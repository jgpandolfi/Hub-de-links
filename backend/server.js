// Dependências necessárias
import Fastify from "fastify"
import fastifyCors from "@fastify/cors"
import fastifyRateLimit from "@fastify/rate-limit"
import pkg from "pg"
const { Pool } = pkg
import Joi from "joi"
import sanitizeHtml from "sanitize-html"
import requestIp from "request-ip"
import geoip from "geoip-lite"
import useragent from "useragent"
import axios from "axios"
import "dotenv/config"

console.log("✅ Iniciando configuração do servidor...")

// Instância do Fastify
const fastify = Fastify({
  logger: true,
  trustProxy: true,
})

console.log("✅ Instância do Fastify criada com sucesso")

// Configuração do CORS
const origensPermitidas = [
  process.env.FRONTEND_URL,
  `http://localhost:${process.env.PORT || 3000}`,
  "http://localhost",
  "https://localhost",
].filter(Boolean)

console.log("✅ Origens CORS permitidas:", origensPermitidas)

await fastify.register(fastifyCors, {
  origin: (origin, cb) => {
    if (!origin || origensPermitidas.includes(origin)) {
      cb(null, true)
      return
    }
    console.log("❌ Tentativa de acesso bloqueada pelo CORS:", origin)
    cb(new Error("Bloqueado pelo CORS"), false)
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
})

console.log("✅ Configuração CORS aplicada com sucesso")

// Rate Limiting
await fastify.register(fastifyRateLimit, {
  global: true,
  max: 50,
  timeWindow: "15 minutes",
  errorMessage:
    "Muitas requisições detectadas. Por favor, aguarde alguns minutos.",
})

console.log("✅ Rate limit global configurado")

// Rate Limit específico para rotas de visitantes
await fastify.register(fastifyRateLimit, {
  global: false,
  max: 5,
  timeWindow: "1 minute",
  errorMessage: "Muitos acessos detectados. Aguarde um momento.",
  routePrefix: ["/registrar-visitante", "/atualizar-visitante"],
})

console.log("✅ Rate limit específico para rotas de visitantes configurado")

// Configuração do pool de conexão PostgreSQL
console.log("⏳ Tentando estabelecer conexão com o banco de dados...")

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Criação da tabela se ela não existir
async function criarTabelaSeNaoExistir() {
  try {
    const checkTable = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'visitantes'
      );`

    const tableExists = await pool.query(checkTable)

    if (!tableExists.rows[0].exists) {
      const createTable = `
        CREATE TABLE visitantes (
          id SERIAL PRIMARY KEY,
          visitor_id VARCHAR(50) NOT NULL,
          timestamp_inicio TIMESTAMP NOT NULL,
          data_acesso_br VARCHAR(10) NOT NULL,
          hora_acesso_br VARCHAR(8) NOT NULL,
          endereco_ip VARCHAR(45),
          cidade VARCHAR(100),
          estado VARCHAR(100),
          pais VARCHAR(100),
          sistema_operacional VARCHAR(100),
          navegador VARCHAR(200),
          utm_source VARCHAR(100) DEFAULT 'acesso-direto',
          total_cliques INTEGER DEFAULT 0,
          cliques_validos INTEGER DEFAULT 0,
          tempo_permanencia VARCHAR(20) DEFAULT '00 min 00 s'
        );`

      await pool.query(createTable)
      console.log("✅ Tabela 'visitantes' criada com sucesso")
    } else {
      console.log("✅ Tabela 'visitantes' já existe")
    }
  } catch (erro) {
    console.error("❌ Erro ao verificar/criar tabela:", erro)
    throw erro
  }
}

// Schemas de validação
const schemaRegistrarVisitante = Joi.object({
  visitor_id: Joi.string()
    .pattern(/^v_\d{13}_[a-f0-9]{9}$/)
    .required()
    .messages({
      "string.pattern.base": "ID do visitante inválido ou mal formatado",
      "any.required": "ID do visitante é obrigatório",
      "string.empty": "ID do visitante não pode estar vazio",
    }),
  timestamp_inicio: Joi.date().iso().required(),
  data_acesso_br: Joi.string()
    .pattern(/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/)
    .required(),
  hora_acesso_br: Joi.string()
    .pattern(/^[0-9]{2}:[0-9]{2}:[0-9]{2}$/)
    .required(),
  sistema_operacional: Joi.string().max(100),
  navegador: Joi.string().max(200),
  utm_source: Joi.string().max(100).default("acesso-direto"),
  total_cliques: Joi.number().integer().min(0).default(0),
  cliques_validos: Joi.number().integer().min(0).default(0),
  tempo_permanencia: Joi.string()
    .pattern(/^[0-9]{2} min [0-9]{2} s$/)
    .default("00 min 00 s"),
})

console.log("✅ Schemas de validação configurados")

// Função para obter a geolocalização do usuário baseado no IP
async function obterGeolocalizacao(ip) {
  try {
    // Primeira tentativa com ipapi.co
    const response = await axios.get(`https://ipapi.co/${ip}/json/`)
    const data = response.data

    if (data.city && data.region && data.country_name) {
      return {
        cidade: data.city,
        estado: data.region,
        pais: data.country_name,
      }
    }

    // Segunda tentativa com ipinfo.io
    const ipinfoResponse = await axios.get(`https://ipinfo.io/${ip}/json`)
    const ipinfoData = ipinfoResponse.data

    return {
      cidade: ipinfoData.city || "Desconhecido",
      estado: ipinfoData.region || "Desconhecido",
      pais: ipinfoData.country || "Desconhecido",
    }
  } catch (erro) {
    console.error("❌ Erro ao obter geolocalização do visitante:", erro)
    return {
      cidade: "Desconhecido",
      estado: "Desconhecido",
      pais: "Desconhecido",
    }
  }
}

// Rotas
fastify.post("/registrar-visitante", async (request, reply) => {
  console.log("⏳ Processando novo registro de visitante...")

  const ip = requestIp.getClientIp(request)
  const userAgent = useragent.parse(request.headers["user-agent"])
  const geolocalizacao = await obterGeolocalizacao(ip)
  const agora = new Date()

  console.log("✅ Dados iniciais do visitante coletados:", {
    ip,
    userAgent: userAgent.toString(),
  })

  const dadosVisitante = {
    visitor_id: request.body.visitor_id,
    timestamp_inicio: agora.toISOString(),
    data_acesso_br: agora.toLocaleDateString("pt-BR"),
    hora_acesso_br: agora.toLocaleTimeString("pt-BR"),
    endereco_ip: ip,
    cidade: sanitizeHtml(geolocalizacao?.cidade || "Desconhecido"),
    estado: sanitizeHtml(geolocalizacao?.estado || "Desconhecido"),
    pais: sanitizeHtml(geolocalizacao?.pais || "Desconhecido"),
    sistema_operacional: sanitizeHtml(userAgent.os.toString()),
    navegador: sanitizeHtml(userAgent.toAgent()),
    utm_source: sanitizeHtml(request.body.utm_source || "acesso-direto"),
    total_cliques: parseInt(request.body.total_cliques || 0),
    cliques_validos: parseInt(request.body.cliques_validos || 0),
    tempo_permanencia: request.body.tempo_permanencia || "00 min 00 s",
  }

  const { error, value } = schemaRegistrarVisitante.validate(dadosVisitante, {
    abortEarly: false,
    stripUnknown: true,
  })

  if (error) {
    console.log("❌ Erro na validação dos dados:", error.details[0].message)
    return reply.code(400).send({
      erro: "O padrão dos dados recebidos não está correto.",
      detalhes: error.details[0].message,
    })
  }

  try {
    console.log("⏳ Salvando dados no banco...")

    // Garantir que todos os campos necessários estejam presentes
    const dadosCompletos = {
      visitor_id: value.visitor_id,
      timestamp_inicio: value.timestamp_inicio,
      data_acesso_br: value.data_acesso_br,
      hora_acesso_br: value.hora_acesso_br,
      endereco_ip: value.endereco_ip || "Desconhecido",
      cidade: value.cidade || "Desconhecido",
      estado: value.estado || "Desconhecido",
      pais: value.pais || "Desconhecido",
      sistema_operacional: value.sistema_operacional || "Desconhecido",
      navegador: value.navegador || "Desconhecido",
      utm_source: value.utm_source || "acesso-direto",
      total_cliques: value.total_cliques || 0,
      cliques_validos: value.cliques_validos || 0,
      tempo_permanencia: value.tempo_permanencia || "00 min 00 s",
    }

    const query = `
    INSERT INTO visitantes (
      visitor_id, timestamp_inicio, data_acesso_br, hora_acesso_br,
      endereco_ip, cidade, estado, pais, sistema_operacional,
      navegador, utm_source, total_cliques, cliques_validos, tempo_permanencia
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING id, visitor_id
  `

    const valores = [
      dadosCompletos.visitor_id,
      dadosCompletos.timestamp_inicio,
      dadosCompletos.data_acesso_br,
      dadosCompletos.hora_acesso_br,
      dadosCompletos.endereco_ip,
      dadosCompletos.cidade,
      dadosCompletos.estado,
      dadosCompletos.pais,
      dadosCompletos.sistema_operacional,
      dadosCompletos.navegador,
      dadosCompletos.utm_source,
      dadosCompletos.total_cliques,
      dadosCompletos.cliques_validos,
      dadosCompletos.tempo_permanencia,
    ]

    const resultado = await pool.query(query, valores)
    console.log("✅ Dados salvos com sucesso no banco")

    await enviarNotificacaoDiscord(dadosCompletos)

    fastify.log.info(
      `✅ Novo visitante registrado: ${resultado.rows[0].visitor_id}`
    )

    return reply.code(201).send({
      mensagem: "Visitante registrado com sucesso",
      id: resultado.rows[0].id,
      visitor_id: resultado.rows[0].visitor_id,
    })
  } catch (erro) {
    console.log("❌ Erro ao salvar dados:", erro)
    fastify.log.error(`❌ Erro ao registrar visitante: ${erro.message}`)
    return reply.code(500).send({
      erro: "Erro interno ao registrar visitante",
      detalhes: erro.message,
    })
  }
})

// Rota para atualizar dados do visitante
fastify.put("/atualizar-visitante/:visitor_id", async (request, reply) => {
  console.log("⏳ Processando atualização de dados do visitante...")

  // Schema de validação para atualização
  const schemaAtualizarVisitante = Joi.object({
    total_cliques: Joi.number().integer().min(0).required(),
    cliques_validos: Joi.number().integer().min(0).required(),
    tempo_permanencia: Joi.string()
      .pattern(/^[0-9]{2} min [0-9]{2} s$/)
      .required(),
    utm_source: Joi.string().max(100).required(),
  })

  try {
    // Validação dos dados recebidos
    const { error, value } = schemaAtualizarVisitante.validate(request.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      console.log("❌ Erro na validação dos dados:", error.details[0].message)
      return reply.code(400).send({
        erro: "Dados de atualização inválidos",
        detalhes: error.details[0].message,
      })
    }

    // Query para atualizar os dados do visitante
    const query = `
      UPDATE visitantes 
      SET 
        total_cliques = $1,
        cliques_validos = $2,
        tempo_permanencia = $3,
        utm_source = $4
      WHERE visitor_id = $5
      RETURNING *
    `

    const valores = [
      value.total_cliques,
      value.cliques_validos,
      value.tempo_permanencia,
      value.utm_source,
      request.params.visitor_id,
    ]

    const resultado = await pool.query(query, valores)

    if (resultado.rowCount === 0) {
      console.log("❌ Visitante não encontrado:", request.params.visitor_id)
      return reply.code(404).send({
        erro: "Visitante não encontrado",
      })
    }

    console.log("✅ Dados do visitante atualizados com sucesso")
    return reply.code(200).send({
      mensagem: "Dados atualizados com sucesso",
      dados: resultado.rows[0],
    })
  } catch (erro) {
    console.error("❌ Erro ao atualizar dados:", erro)
    return reply.code(500).send({
      erro: "Erro interno ao atualizar dados do visitante",
      detalhes: erro.message,
    })
  }
})

// Função para enviar notificação ao Discord
async function enviarNotificacaoDiscord(dadosVisitante) {
  console.log("⏳ Enviando notificação ao Discord...")

  try {
    const mensagem = {
      embeds: [
        {
          title: "🌟 Novo Visitante Detectado!",
          color: 3447003,
          fields: [
            {
              name: "📅 Data e Hora",
              value: `${dadosVisitante.data_acesso_br} às ${dadosVisitante.hora_acesso_br}`,
            },
            {
              name: "📍 Localização",
              value: `${dadosVisitante.cidade}, ${dadosVisitante.estado}, ${dadosVisitante.pais}`,
            },
            {
              name: "💻 Dispositivo",
              value: `${dadosVisitante.sistema_operacional}\n${dadosVisitante.navegador}`,
            },
            {
              name: "🔍 Origem",
              value: dadosVisitante.utm_source || "Acesso Direto",
            },
          ],
          footer: {
            text: `ID: ${dadosVisitante.visitor_id}`,
          },
          timestamp: new Date().toISOString(),
        },
      ],
    }

    await axios.post(process.env.DISCORD_WEBHOOK_URL, mensagem)
    console.log("✅ Notificação enviada ao Discord com sucesso")
  } catch (erro) {
    console.log("❌ Erro ao enviar notificação ao Discord:", erro.message)
  }
}

// Inicialização do servidor
const start = async () => {
  try {
    console.log("⏳ Iniciando conexão com o banco de dados...")
    await pool.connect()
    console.log("✅ Conexão com o banco de dados estabelecida")

    // Adicionar esta linha
    await criarTabelaSeNaoExistir()

    console.log("⏳ Iniciando servidor Fastify...")
    await fastify.listen({
      port: process.env.PORT || 3000,
      host: "0.0.0.0",
    })
    console.log("✅ Servidor Fastify iniciado com sucesso")
  } catch (erro) {
    console.log("❌ Erro fatal ao iniciar servidor:", erro)
    fastify.log.error(erro)
    process.exit(1)
  }
}

start()

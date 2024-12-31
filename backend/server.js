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

// Rotas
fastify.post("/registrar-visitante", async (request, reply) => {
  console.log("⏳ Processando novo registro de visitante...")

  const ip = requestIp.getClientIp(request)
  const userAgent = useragent.parse(request.headers["user-agent"])
  const geolocalizacao = geoip.lookup(ip)
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
    cidade: sanitizeHtml(geolocalizacao?.city || "Desconhecido"),
    estado: sanitizeHtml(geolocalizacao?.region || "Desconhecido"),
    pais: sanitizeHtml(geolocalizacao?.country || "Desconhecido"),
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

    const query = `
      INSERT INTO visitantes (
        visitor_id, timestamp_inicio, data_acesso_br, hora_acesso_br,
        endereco_ip, cidade, estado, pais, sistema_operacional,
        navegador, utm_source, total_cliques, cliques_validos, tempo_permanencia
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id, visitor_id
    `
    const resultado = await pool.query(query, Object.values(value))

    console.log("✅ Dados salvos com sucesso no banco")

    await enviarNotificacaoDiscord(value)

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

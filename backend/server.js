// Dependências necessárias
const express = require("express")
const rateLimit = require("express-rate-limit")
const { Pool } = require("pg")
const requestIp = require("request-ip")
const geoip = require("geoip-lite")
const useragent = require("useragent")
require("dotenv").config()
const cors = require("cors")
const axios = require("axios")

// Instância do Express
const app = express()
const porta = process.env.PORT || 3000

//  Mensagem ao console confirmando inicialização do servidor
console.log("✅ Servidor Node.JS iniciado!")

// Configuração do CORS
const origensPermitidas = [
  process.env.FRONTEND_URL,
  `http://localhost:${porta}`,
  "http://localhost",
  "https://localhost",
].filter(Boolean)

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origensPermitidas.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Bloqueado pelo CORS"))
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
}

// Limiter global para todas as rotas
const limiterGlobal = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // Limite de 100 requisições por IP
  message: {
    erro: "Muitas requisições detectadas. Por favor, aguarde alguns minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Limiter específico para rotas de registro
const limiterVisitantes = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5, // Limite de 5 tentativas por minuto
  message: {
    erro: "Muitos acessos do seu endereço detectados. Aguarde um momento.",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Middlewares
app.use(cors(corsOptions))
app.use(express.json())
app.use(requestIp.mw())

// Aplica os limitadores (ratelimit)
app.use(limiterGlobal)
app.use("/registrar-visitante", limiterVisitantes)
app.use("/atualizar-visitante", limiterVisitantes)

// Headers de segurança adicionais
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true)
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  )
  next()
})

// Tratamento de erros CORS
app.use((err, req, res, next) => {
  if (err.message === "Bloqueado pelo CORS") {
    res.status(403).json({
      erro: "Acesso não autorizado para esta origem",
    })
  } else {
    next(err)
  }
})

// Configuração do pool de conexão
console.log("⏳ Tentando conectar ao banco de dados...")
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Testar conexão inicial com o banco
pool
  .connect()
  .then(() => {
    console.log("✅ Conexão com o banco de dados estabelecida com sucesso!")
  })
  .catch((erro) => {
    console.error("❌ Erro ao conectar com banco de dados:", erro.message)
  })

// Query para criar tabela de visitantes
const criarTabelaVisitantes = `
  CREATE TABLE IF NOT EXISTS visitantes (
    id SERIAL PRIMARY KEY,
    visitor_id VARCHAR(50) UNIQUE NOT NULL,
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
    tempo_permanencia INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`

// Query para criar tabela de sessões
const criarTabelaSessoes = `
  CREATE TABLE IF NOT EXISTS sessoes (
    id SERIAL PRIMARY KEY,
    visitor_id VARCHAR(50) REFERENCES visitantes(visitor_id),
    inicio_sessao TIMESTAMP NOT NULL,
    fim_sessao TIMESTAMP,
    duracao_segundos INTEGER,
    paginas_visitadas INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`

// Função para inicializar o banco de dados
async function inicializarBancoDeDados() {
  try {
    console.log("⏳ Verificando/criando tabelas no banco de dados...")
    await pool.query(criarTabelaVisitantes)
    await pool.query(criarTabelaSessoes)
    console.log("✅ Tabelas verificadas/criadas com sucesso!")
  } catch (erro) {
    console.error("❌ Erro ao criar tabelas:", erro.message)
    throw erro
  }
}

// Middleware para verificar conexão com banco
app.use(async (req, res, next) => {
  try {
    await pool.query("SELECT NOW()")
    next()
  } catch (erro) {
    console.error("❌ Erro na conexão com banco:", erro.message)
    res.status(500).json({
      erro: "Erro de conexão com o banco de dados",
      detalhes: erro.message,
    })
  }
})

// Rota de teste/health check
app.get("/health", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT NOW()")
    res.status(200).json({
      status: "online",
      timestamp: resultado.rows[0].now,
    })
  } catch (erro) {
    console.error("❌ Erro no health check:", erro.message)
    res.status(500).json({
      status: "erro",
      mensagem: erro.message,
    })
  }
})

// Rota para registrar novo visitante
app.post("/registrar-visitante", async (req, res) => {
  try {
    const ip = req.clientIp
    const userAgent = useragent.parse(req.headers["user-agent"])
    const geolocalizacao = geoip.lookup(ip)

    const agora = new Date()
    const dadosVisitante = {
      visitor_id: req.body.visitor_id || `v_${Date.now()}`,
      timestamp_inicio: agora.toISOString(),
      data_acesso_br: agora.toLocaleDateString("pt-BR"),
      hora_acesso_br: agora.toLocaleTimeString("pt-BR"),
      endereco_ip: ip,
      cidade: geolocalizacao?.city || "Desconhecido",
      estado: geolocalizacao?.region || "Desconhecido",
      pais: geolocalizacao?.country || "Desconhecido",
      sistema_operacional: userAgent.os.toString(),
      navegador: userAgent.toAgent(),
      utm_source: req.body.utm_source || "acesso-direto",
      total_cliques: 0,
      cliques_validos: 0,
      tempo_permanencia: 0,
    }

    const query = `
      INSERT INTO visitantes (
        visitor_id, timestamp_inicio, data_acesso_br, hora_acesso_br,
        endereco_ip, cidade, estado, pais, sistema_operacional,
        navegador, utm_source, total_cliques, cliques_validos, tempo_permanencia
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id, visitor_id`

    const resultado = await pool.query(query, [
      dadosVisitante.visitor_id,
      dadosVisitante.timestamp_inicio,
      dadosVisitante.data_acesso_br,
      dadosVisitante.hora_acesso_br,
      dadosVisitante.endereco_ip,
      dadosVisitante.cidade,
      dadosVisitante.estado,
      dadosVisitante.pais,
      dadosVisitante.sistema_operacional,
      dadosVisitante.navegador,
      dadosVisitante.utm_source,
      dadosVisitante.total_cliques,
      dadosVisitante.cliques_validos,
      dadosVisitante.tempo_permanencia,
    ])

    // Chamar função para enviar mensagem no Discord
    await enviarNotificacaoDiscord(dadosVisitante)

    console.log("✅ Novo visitante registrado:", resultado.rows[0].visitor_id)
    res.status(201).json({
      mensagem: "Visitante registrado com sucesso",
      id: resultado.rows[0].id,
      visitor_id: resultado.rows[0].visitor_id,
    })
  } catch (erro) {
    console.error("❌ Erro ao registrar visitante:", erro.message)
    res.status(500).json({
      erro: "Erro interno ao registrar visitante",
      detalhes: erro.message,
    })
  }
})

// Rota para atualizar dados do visitante
app.put("/atualizar-visitante/:visitor_id", async (req, res) => {
  try {
    const { visitor_id } = req.params
    const { total_cliques, cliques_validos, tempo_permanencia, utm_source } =
      req.body

    const query = `
      UPDATE visitantes 
      SET total_cliques = $1, 
          cliques_validos = $2, 
          tempo_permanencia = $3,
          utm_source = COALESCE($4, utm_source)
      WHERE visitor_id = $5
      RETURNING *`

    const resultado = await pool.query(query, [
      total_cliques,
      cliques_validos,
      tempo_permanencia,
      utm_source,
      visitor_id,
    ])

    if (resultado.rows.length === 0) {
      console.log(
        "⚠️ Tentativa de atualização de visitante não encontrado:",
        visitor_id
      )
      return res.status(404).json({ erro: "Visitante não encontrado" })
    }

    console.log("✅ Dados do visitante atualizados:", visitor_id)
    res.status(200).json({
      mensagem: "Dados atualizados com sucesso",
      dados: resultado.rows[0],
    })
  } catch (erro) {
    console.error("❌ Erro ao atualizar dados:", erro.message)
    res.status(500).json({
      erro: "Erro interno ao atualizar dados",
      detalhes: erro.message,
    })
  }
})

// Inicializa o banco e inicia o servidor
inicializarBancoDeDados()
  .then(() => {
    app.listen(porta, () => {
      console.log(`✅ Servidor rodando na porta ${porta}!`)
    })
  })
  .catch((erro) => {
    console.error("❌ Erro fatal ao inicializar o servidor:", erro.message)
    process.exit(1)
  })

// Tratamento de erros não capturados
process.on("unhandledRejection", (erro) => {
  console.error("❌ Erro não tratado:", erro)
})

// Webhook Discord
// Declara a variável de ambiente que armazena a Webhook do Discord
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

// Função para enviar notificação ao Discord
async function enviarNotificacaoDiscord(dadosVisitante) {
  try {
    const mensagem = {
      embeds: [
        {
          title: "🌟 Novo Visitante Detectado!",
          color: 3447003, // Azul Discord
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

    await axios.post(DISCORD_WEBHOOK_URL, mensagem)
    console.log("✅ Notificação enviada ao Discord!")
  } catch (erro) {
    console.error("❌ Erro ao enviar notificação ao Discord:", erro.message)
  }
}

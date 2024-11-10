// Carrega as dependências necessárias
const express = require("express")
const { Pool } = require("pg")
const requestIp = require("request-ip")
const geoip = require("geoip-lite")
const useragent = require("useragent")
require("dotenv").config()
const cors = require("cors")

// Inicia uma nova instância do express
const app = express()
const porta = process.env.PORTA || 3000 // Porta pode ser definida a partir do .env

// Configura o CORS para permitir que o frontend se conecte ao backend
app.use(cors())
app.use(express.json()) // Habilita o middleware para processar JSON no corpo das requisições

// Configuração do pool de conexão com o banco de dados
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

// Função para registrar dados de sessão no banco de dados
app.post("/registrar-acesso", async (req, res) => {
  // Obter o IP do usuário
  const ip = requestIp.getClientIp(req)

  // Obter informações sobre o agente do usuário (navegador, sistema operacional)
  const browser = useragent.parse(req.headers["user-agent"])

  // Geolocalização com base no IP
  const geolocalizacao = geoip.lookup(ip)
  const localizacao = geolocalizacao
    ? `${geolocalizacao.city} - ${geolocalizacao.region} - ${geolocalizacao.country}`
    : "Desconhecido"

  // Capturar data e hora local do acesso
  const agora = new Date()
  const dataAcesso = agora.toLocaleDateString("pt-BR") // Data no formato DD/MM/AAAA
  const horaAcesso = agora.toLocaleTimeString("pt-BR") // Hora no formato HH:MM:SS
  const timestamp = agora.toISOString() // Timestamp global (em UTC)

  // Extrair dados do corpo da requisição
  const { utm_source, tipo_dispositivo, total_cliques, cliques_links } =
    req.body

  // A duração da sessão será um valor placeholder por enquanto
  const duracaoSessao = "00:00:00" // Placeholder para a duração

  // Salvar no banco de dados
  try {
    const resultado = await pool.query(
      `INSERT INTO acessos_usuario (
        data_acesso, hora_acesso, timestamp, duracao_sessao, utm_source, 
        endereco_ip, provedor, geolocalizacao, tipo_dispositivo, so, 
        browser, total_cliques, cliques_links
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      )`,
      [
        dataAcesso,
        horaAcesso,
        timestamp,
        duracaoSessao,
        utm_source,
        ip,
        geolocalizacao ? geolocalizacao.org : "Desconhecido",
        localizacao,
        tipo_dispositivo,
        browser.os.family,
        browser.toAgent(),
        total_cliques,
        cliques_links,
      ]
    )
    console.log("Acesso registrado com sucesso!")
    res.status(200).send("Acesso registrado com sucesso!")
  } catch (erro) {
    console.error("Erro ao registrar acesso:", erro)
    res.status(500).send("Erro ao registrar acesso")
  }
})

// Inicia o servidor
app.listen(porta, () => {
  console.log(`Servidor iniciado na porta ${porta}!`)
})

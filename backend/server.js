// Carrega o framework express.js
const express = require("express")

// Cria uma nova pool de conexão através da biblioteca do PostgreSQL
const { Pool } = require("pg")

// Carrega variáveis de ambiente do arquivo .env
require("dotenv").config()

// Inicia uma nova instância do express (servidor)
const app = express()
const port = process.env.PORT || 3000

// Configuração do pool de conexão com o banco de dados
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

// Rota de teste para verificar a conexão com o banco
app.get("/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()")
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send("Erro na conexão com o banco de dados")
  }
})

// Inicia a escuta do servidor
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}!`)
})

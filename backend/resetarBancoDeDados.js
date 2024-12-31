import pg from "pg"
import * as readline from "readline"
import "dotenv/config"

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function limparBancoDeDados() {
  try {
    console.log("\n⏳ Tentando estabelecer conexão com o banco de dados...")
    await pool.connect()
    console.log("✅ Conexão estabelecida com sucesso!")

    console.log("\n⏳ Iniciando limpeza do banco de dados...")

    // Remover tabelas em ordem específica devido às dependências
    console.log("⏳ Removendo tabela 'sessoes'...")
    await pool.query("DROP TABLE IF EXISTS sessoes;")

    console.log("⏳ Removendo tabela 'visitantes'...")
    await pool.query("DROP TABLE IF EXISTS visitantes;")

    console.log("\n✅ Banco de dados limpo com sucesso!")
    process.exit(0)
  } catch (erro) {
    console.error("\n❌ Erro ao limpar banco de dados:", erro.message)
    process.exit(1)
  }
}

function iniciar() {
  console.log(
    "\n⚠️  ATENÇÃO: Esta operação irá apagar TODOS os dados do banco de dados!"
  )
  rl.question(
    "Você realmente deseja limpar e resetar todo o banco de dados? (S/N): ",
    async (resposta) => {
      if (resposta.toUpperCase() === "S") {
        await limparBancoDeDados()
      } else {
        console.log("\n❌ Operação cancelada pelo usuário")
        process.exit(0)
      }
      rl.close()
    }
  )
}

iniciar()

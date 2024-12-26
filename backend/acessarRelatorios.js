// Dependências necessárias
const { Pool } = require("pg")
const readline = require("readline")
const fs = require("fs")
require("dotenv").config()

// Configuração do pool de conexão
console.log("⏳ Tentando conectar ao banco de dados...")
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Criar interface para o prompt
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Função para formatar data
function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

// Função principal
async function gerarRelatorio() {
  try {
    // Testar conexão com o banco
    await pool.connect()
    console.log("✅ Conexão com o banco de dados estabelecida com sucesso!")

    // Perguntar ao usuário
    rl.question("Digite o número de dias para o relatório: ", async (dias) => {
      console.log(`⏳ Buscando dados dos últimos ${dias} dias...`)

      try {
        // Query para buscar os dados
        const query = `
          SELECT *
          FROM visitantes
          WHERE timestamp_inicio >= NOW() - INTERVAL '${dias} days'
          ORDER BY timestamp_inicio DESC;
        `

        const resultado = await pool.query(query)
        const visitantes = resultado.rows

        if (visitantes.length === 0) {
          console.log("❌ Nenhum visitante encontrado neste período")
          process.exit(0)
        }

        // Preparar conteúdo do relatório
        let conteudoRelatorio = `RELATÓRIO DE VISITANTES - ÚLTIMOS ${dias} DIAS\n`
        conteudoRelatorio += `Gerado em: ${formatarData(new Date())}\n`
        conteudoRelatorio += `Total de visitantes: ${visitantes.length}\n`
        conteudoRelatorio += "=".repeat(50) + "\n\n"

        // Adicionar dados de cada visitante
        visitantes.forEach((visitante, index) => {
          conteudoRelatorio += `Visitante #${index + 1}\n`
          conteudoRelatorio += `-`.repeat(20) + "\n"
          conteudoRelatorio += `ID: ${visitante.visitor_id}\n`
          conteudoRelatorio += `Data: ${visitante.data_acesso_br}\n`
          conteudoRelatorio += `Hora: ${visitante.hora_acesso_br}\n`
          conteudoRelatorio += `IP: ${visitante.endereco_ip}\n`
          conteudoRelatorio += `Localização: ${visitante.cidade}, ${visitante.estado}, ${visitante.pais}\n`
          conteudoRelatorio += `Sistema Operacional: ${visitante.sistema_operacional}\n`
          conteudoRelatorio += `Navegador: ${visitante.navegador}\n`
          conteudoRelatorio += `Origem do tráfego: ${visitante.utm_source}\n`
          conteudoRelatorio += `Total de cliques: ${visitante.total_cliques}\n`
          conteudoRelatorio += `Cliques válidos: ${visitante.cliques_validos}\n`
          conteudoRelatorio += `Tempo de permanência: ${visitante.tempo_permanencia} segundos\n`
          conteudoRelatorio += "\n" + "=".repeat(50) + "\n\n"
        })

        // Nome do arquivo com timestamp
        const nomeArquivo = `relatorio_visitantes_${new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/:/g, "-")}.txt`

        // Salvar arquivo
        fs.writeFileSync(nomeArquivo, conteudoRelatorio)
        console.log(`✅ Relatório gerado com sucesso: ${nomeArquivo}`)

        // Fechar conexões
        rl.close()
        await pool.end()
        process.exit(0)
      } catch (erro) {
        console.error("❌ Erro ao gerar relatório:", erro.message)
        process.exit(1)
      }
    })
  } catch (erro) {
    console.error("❌ Erro ao conectar com banco de dados:", erro.message)
    process.exit(1)
  }
}

// Iniciar o programa
gerarRelatorio()

// Tratamento de erros não capturados
process.on("unhandledRejection", (erro) => {
  console.error("❌ Erro não tratado:", erro)
  process.exit(1)
})

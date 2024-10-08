// Detectar se o visitante está usando um dispositivo móvel
// para alterar o CSS (velocidade da animação de fundo)
// Lista de Sistemas Operacionais conhecidos para desktop
const desktopOS = [
  "Windows",
  "Windows Server",
  "Windows XP",
  "OS X",
  "Ubuntu",
  "Windows Vista",
  "Windows 7",
  "Windows 8",
  "Windows 10",
  "Windows 11",
  "Debian",
  "Fedora",
]

// Função para verificar se o "browser agent" é um navegador de desktop
function isDesktop() {
  let SOatual = platform.os.family
  return desktopOS.some((browser) => SOatual.includes(browser))
}

if (isDesktop()) {
  // Se for um dispositivo móvel, alterar a duração da animação
  document.querySelector("body").style.animation =
    "moverFundo 320s infinite alternate linear"
}

// ======================
// Alternar modo escuro/claro
function toggleMode() {
  const html = document.documentElement
  html.classList.toggle("light")
}

// ======================
// Funções para box de informações do visitante
// Função para obter o endereço IP do usuário usando uma API de terceiros
function obterIP() {
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("IP").textContent = data.ip
    })
    .catch((error) =>
      console.error("Ocorreu um erro ao obter o endereço IP:", error)
    )
}

// Função para obter o SO do usuário
function obterSO() {
  document.getElementById("SO").textContent = platform.os.family
}

// Função para obter o browser do usuário
function obterBrowser() {
  let userAgent = navigator.userAgent
  let browser

  switch (true) {
    case /Firefox/i.test(userAgent):
      browser = "Firefox"
      break
    case /Chrome/i.test(userAgent):
      browser = "Chrome"
      break
    case /Safari/i.test(userAgent):
      if (/CriOS/i.test(userAgent)) {
        browser = "Chrome (iOS)"
      } else {
        browser = "Safari"
      }
      break
    case /Opera|OPR/i.test(userAgent):
      browser = "Opera"
      break
    case /Edge/i.test(userAgent):
      browser = "Edge"
      break
    case /MSIE|Trident/i.test(userAgent):
      browser = "Internet Explorer"
      break
    case /CriOS|FxiOS|OPiOS|SamsungBrowser|UCBrowser|Opera Mini|Opera Touch|Dolfin|Puffin|Mercury|Focus|Coast|Mobile|Mobile Safari|Android|Bolt|IEMobile|Silk|Skyfire|Nokia|UCWEB|BREW|Minimo|NetFront|Novarra|Vision|MQQBrowser|MicroMessenger|Weibo|MQQBrowser|Baidu|Alipay|QQ/i.test(
      userAgent
    ):
      browser = "Outros navegadores móveis"
      break
    default:
      browser = "Desconhecido"
  }
  document.getElementById("browser").innerText = browser
}

// Obter ISP do usuário
function obterISP() {
  fetch("https://ipinfo.io/json")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("ISP").textContent = data.org
    })
    .catch((error) => console.error("Ocorreu um erro ao obter o ISP:", error))
}

// Obter geolocalização do usuário com base no endereço IP
function obterLoc() {
  fetch("https://ipapi.co/json/")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById(
        "loc"
      ).textContent = `${data.city}, ${data.region}, ${data.country_name}`
    })
    .catch((error) =>
      console.error("Ocorreu um erro ao obter a localização:", error)
    )
}

// Obter a origem do tráfego com base no UTM Source
// Obtendo parâmetros da URL aberta
function getParameterByName(name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, "\\$&")
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ""
  return decodeURIComponent(results[2].replace(/\+/g, " "))
}
// Obter o valor do parâmetro UTM source da URL
let utmSource = getParameterByName("utm_source")
// Exibir a origem do tráfego
if (utmSource) {
  document.getElementById("UTM").textContent = utmSource
} else {
  document.getElementById("UTM").textContent = "Tráfego direto"
}

// ======================
// Funções para alteração no idioma do conteúdo da página
function trocarConteudoParaEN() {
  const iBemVindo = document.querySelector("#i-bem-vindo")
  iBemVindo.textContent = "Welcome to my link hub!"

  const iSuasInfos = document.querySelector("#i-suas-infos")
  iSuasInfos.textContent = "Your data:"

  const sProvedor = document.querySelector("#s-provedor")
  sProvedor.textContent = "ISP:"

  const sLoc = document.querySelector("#s-loc")
  sLoc.textContent = "Location:"

  const sSO = document.querySelector("#s-so")
  sSO.textContent = "Operating system:"

  const sVindoDe = document.querySelector("#s-vindo-de")
  sVindoDe.textContent = "Referred from:"

  const fDesenvolvidoPor = document.querySelector("#f-desenvolvido-por")
  fDesenvolvidoPor.textContent = "Developed by Jota / José Guilherme Pandolfi"

  const aPerfilDio = document.querySelector("#a-perfil-dio")
  aPerfilDio.innerHTML =
    '<ion-icon name="ribbon-outline"></ion-icon> Dio.me profile'

  const aRockNacional = document.querySelector("#a-rock-nacional")
  aRockNacional.innerHTML =
    '<ion-icon name="play-circle-outline"></ion-icon>Playlist Brazilian Rock 2000'

  const utmTexto = document.querySelector("#UTM")
  if (utmTexto.textContent == "Tráfego direto") {
    utmTexto.textContent = "Direct traffic"
  }
}

function trocarConteudoParaPT() {
  const pBemVindo = document.querySelector("#i-bem-vindo")
  pBemVindo.textContent = "Bem-vindo ao meu hub de links!"

  const iSuasInfos = document.querySelector("#i-suas-infos")
  iSuasInfos.textContent = "Suas informações:"

  const sProvedor = document.querySelector("#s-provedor")
  sProvedor.textContent = "Provedor:"

  const sLoc = document.querySelector("#s-loc")
  sLoc.textContent = "Localização:"

  const sSO = document.querySelector("#s-so")
  sSO.textContent = "Sistema operacional:"

  const sVindoDe = document.querySelector("#s-vindo-de")
  sVindoDe.textContent = "Vindo de:"

  const fDesenvolvidoPor = document.querySelector("#f-desenvolvido-por")
  fDesenvolvidoPor.textContent =
    "Desenvolvido por Jota / José Guilherme Pandolfi"

  const aPerfilDio = document.querySelector("#a-perfil-dio")
  aPerfilDio.innerHTML =
    '<ion-icon name="ribbon-outline"></ion-icon>Perfil Dio.me'

  const aRockNacional = document.querySelector("#a-rock-nacional")
  aRockNacional.innerHTML =
    '<ion-icon name="play-circle-outline"></ion-icon>Playlist Rock 2000 Nacional'

  const utmTexto = document.querySelector("#UTM")
  if (utmTexto.textContent == "Direct traffic") {
    utmTexto.textContent = "Tráfego direto"
  }
}

// Seleção de idiomas via botão dropdown
// Identificar e selecionar as tags HTML
const btnIdioma = document.querySelector(".btn-idioma")
const listaIdiomas = document.querySelector(".lista-idiomas")

const idiomaSelecionado = document.querySelector(".idioma-selecionado")
const imgIdiomaSelecionado = document.querySelector(".img-idioma-selecionado")

const idiomaNaoSelecionado = document.querySelector(".idioma-nao-selecionado")
const imgIdiomaNaoSelecionado = document.querySelector(
  ".img-idioma-nao-selecionado"
)

function trocarParaEN() {
  imgIdiomaSelecionado.src = "https://flagcdn.com/w160/us.png"
  imgIdiomaSelecionado.srcset = "https://flagcdn.com/w160/us.png 2x"
  idiomaSelecionado.textContent = "EN-US"

  imgIdiomaNaoSelecionado.src = "https://flagcdn.com/w160/br.png"
  imgIdiomaNaoSelecionado.srcset = "https://flagcdn.com/w320/br.png 2x"
  idiomaNaoSelecionado.textContent = "PT-BR"

  trocarConteudoParaEN()
}

function trocarParaPT() {
  imgIdiomaSelecionado.src = "https://flagcdn.com/w160/br.png"
  imgIdiomaSelecionado.srcset = "https://flagcdn.com/w320/br.png 2x"
  idiomaSelecionado.textContent = "PT-BR"

  imgIdiomaNaoSelecionado.src = "https://flagcdn.com/w160/us.png"
  imgIdiomaNaoSelecionado.srcset = "https://flagcdn.com/w160/us.png 2x"
  idiomaNaoSelecionado.textContent = "EN-US"

  trocarConteudoParaPT()
}

btnIdioma.addEventListener("click", () => {
  listaIdiomas.classList.toggle("exibir-lista-idiomas")
})

listaIdiomas.addEventListener("click", () => {
  if (imgIdiomaSelecionado.src == "https://flagcdn.com/w160/br.png") {
    trocarParaEN()
  } else {
    trocarParaPT()
  }
})

// Ajuste automático de idioma
function autoAjusteIdioma() {
  fetch("https://ipapi.co/json/")
    .then((response) => response.json())
    .then((data) => {
      paisOrigem = data.country_name
      if (
        paisOrigem == "Brazil" ||
        "Brasil" ||
        "brazil" ||
        "brasil" ||
        "BR" ||
        "br" ||
        "Portugal" ||
        "portugal"
      ) {
        trocarParaPT()
      } else {
        trocarParaEN()
      }
    })
    .catch((error) =>
      console.error("Ocorreu um erro ao obter a localização:", error)
    )
}

// Chamar funções no carregamento da página
window.onload = function () {
  obterIP()
  obterSO()
  obterBrowser()
  obterISP()
  obterLoc()
  autoAjusteIdioma()
}

// ============
// Recurso para exibir e ocultar o portfólio de design para social media
// Identificar e selecionar o botão utilizado para acessar o portfólio
const btnPortfolio = document.getElementById("btn-portfolio")

// Identificar e selecionar o botão utilizado para voltar aos links (estado inicial)
const btnVoltarParaLinks = document.getElementById("btn-voltar-para-links")

// Identificar e selecionar os containers que devem ser exibidos/ocultados
const divLinks = document.getElementById("container-links")
const divPortfolio = document.getElementById("container-portfolio")

// Criar a função para executar as ações desejadas para abertura do portfólio
function abrirPortfolio() {
  divLinks.style.display = "none"
  divPortfolio.style.display = "block"

  history.replaceState(null, "Porfólio de Design", "/portfolio-design")
}

// Criar a função para executar as ações desejadas para voltar aos links (estado inicial)
function fecharPortfolio() {
  divPortfolio.style.display = "none"
  divLinks.style.display = "block"

  history.replaceState(null, "", "/inicial")

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Adicionar um listener de clique no botão para ir ao portfólio de design
btnPortfolio.addEventListener("click", () => {
  abrirPortfolio()
})

// Adicionar um listener de clique no botão para voltar aos links (estado inicial)
btnVoltarParaLinks.addEventListener("click", () => {
  fecharPortfolio()
})

// =============
// Modal (janela flutuante) para exibir imagem do portfólio ampliada
// Identifica e seleciona a div do modal
const divModal = document.getElementById("modal")

// Obtém a imagem dentro do grid e o elemento modal que exibirá a imagem ampliada
const imgsParaModal = document.querySelectorAll(".img-para-modal")
const imgModalSrcset = document.getElementById("img-modal-srcset")
const imgModal = document.getElementById("img-modal")
const divLegendaParaModal = document.getElementById("legenda-img-modal")

// Para cada imagem no grid, adiciona um evento de clique
imgsParaModal.forEach((img) => {
  img.onclick = function () {
    divModal.style.display = "block" // Exibe o modal
    imgModalSrcset.srcset = this.src.replace(".jpg", ".webp") // Seta o srcset da tag <source>
    imgModal.src = this.src // Seta a imagem no modal
    divLegendaParaModal.textContent = this.alt // Seta a descrição no modal
  }
})

// Identifica e seleciona o botão de fechar (X) do modal
const btnFecharModal = document.getElementById("btn-fechar-modal")

// Quando o botão (X) é clicado, fecha o modal
btnFecharModal.onclick = function () {
  divModal.style.display = "none"
}

// Desenvolvido por Jota / José Guilherme Pandolfi

// Alternar modo escuro/claro
function toggleMode() {
  const html = document.documentElement
  html.classList.toggle("light")
}

// Função para obter o endereço IP usando uma API de terceiros
function obterIP() {
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("IP").innerText = data.ip
    })
    .catch((error) =>
      console.error("Ocorreu um erro ao obter o endereço IP:", error)
    )
}

// Função para obter o SO do usuário
function obterSO() {
  document.getElementById("SO").innerText = platform.os.family
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
      document.getElementById("ISP").innerText = data.org
    })
    .catch((error) => console.error("Ocorreu um erro ao obter o ISP:", error))
}

// Obter geolocalização com base no endereço IP
function obterLoc() {
  fetch("https://ipapi.co/json/")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById(
        "loc"
      ).innerText = `${data.city}, ${data.region}, ${data.country_name}`
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
  document.getElementById("UTM").innerText = utmSource
} else {
  document.getElementById("UTM").innerText = "Tráfego direto"
}

// Funções para alteração no idioma do conteúdo da página
function trocarConteudoParaEN() {
  const iBemVindo = document.querySelector("#iBemVindo")
  iBemVindo.textContent = "Welcome to my link hub!"

  const iSuasInfos = document.querySelector("#iSuasInfos")
  iSuasInfos.textContent = "Your data:"

  const sProvedor = document.querySelector("#sProvedor")
  sProvedor.textContent = "ISP:"

  const sLoc = document.querySelector("#sLoc")
  sLoc.textContent = "Location:"

  const sSO = document.querySelector("#sSO")
  sSO.textContent = "Operating system:"

  const sVindoDe = document.querySelector("#sVindoDe")
  sVindoDe.textContent = "Referred from:"

  const fDesenvolvidoPor = document.querySelector("#fDesenvolvidoPor")
  fDesenvolvidoPor.textContent = "Developed by Jota / José Guilherme Pandolfi"

  const aPerfilDio = document.querySelector("#aPerfilDio")
  aPerfilDio.innerHTML =
    '<ion-icon name="ribbon-outline"></ion-icon> Dio.me profile'

  const aRockNacional = document.querySelector("#aRockNacional")
  aRockNacional.innerHTML =
    '<ion-icon name="play-circle-outline"></ion-icon>Playlist Brazilian Rock 2000'

  const utmTexto = document.querySelector("#UTM")
  if (utmTexto.textContent == "Tráfego direto") {
    utmTexto.textContent = "Direct traffic"
  }
}

function trocarConteudoParaPT() {
  const pBemVindo = document.querySelector("#iBemVindo")
  pBemVindo.textContent = "Bem-vindo ao meu hub de links!"

  const iSuasInfos = document.querySelector("#iSuasInfos")
  iSuasInfos.textContent = "Suas informações:"

  const sProvedor = document.querySelector("#sProvedor")
  sProvedor.textContent = "Provedor:"

  const sLoc = document.querySelector("#sLoc")
  sLoc.textContent = "Localização:"

  const sSO = document.querySelector("#sSO")
  sSO.textContent = "Sistema operacional:"

  const sVindoDe = document.querySelector("#sVindoDe")
  sVindoDe.textContent = "Vindo de:"

  const fDesenvolvidoPor = document.querySelector("#fDesenvolvidoPor")
  fDesenvolvidoPor.textContent =
    "Desenvolvido por Jota / José Guilherme Pandolfi"

  const aPerfilDio = document.querySelector("#aPerfilDio")
  aPerfilDio.innerHTML =
    '<ion-icon name="ribbon-outline"></ion-icon>Perfil Dio.me'

  const aRockNacional = document.querySelector("#aRockNacional")
  aRockNacional.innerHTML =
    '<ion-icon name="play-circle-outline"></ion-icon>Playlist Rock 2000 Nacional'

  const utmTexto = document.querySelector("#UTM")
  if (utmTexto.textContent == "Direct traffic") {
    utmTexto.textContent = "Tráfego direto"
  }
}

// Seleção de idiomas via botão dropdown
const btnIdioma = document.querySelector(".btnIdioma")
const listaIdiomas = document.querySelector(".listaIdiomas")

let idiomaSelecionado = document.querySelector(".idiomaSelecionado")
let imgIdiomaSelecionado = document.querySelector(".imgIdiomaSelecionado")

let idiomaNaoSelecionado = document.querySelector(".idiomaNaoSelecionado")
let imgIdiomaNaoSelecionado = document.querySelector(".imgIdiomaNaoSelecionado")

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
  listaIdiomas.classList.toggle("exibirListaIdiomas")
})

listaIdiomas.addEventListener("click", () => {
  if (imgIdiomaSelecionado.src == "https://flagcdn.com/w160/br.png") {
    trocarParaEN()
  } else {
    trocarParaPT()
  }
})

// Detectar se o visitante está usando um dispositivo móvel para alterar CSS
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
// Função para verificar se o agente de usuário é um navegador de desktop
function isDesktop() {
  let SOatual = platform.os.family
  return desktopOS.some((browser) => SOatual.includes(browser))
}
if (isDesktop()) {
  // Se for um dispositivo móvel, alterar a duração da animação
  document.querySelector("body").style.animation =
    "moverFundo 320s infinite alternate linear"
}

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

// Desenvolvido por Jota / José Guilherme Pandolfi

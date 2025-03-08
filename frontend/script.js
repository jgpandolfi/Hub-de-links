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
// Recurso para alternar entre os modos escuro/claro
// Seleciona e armazena o botão switch em uma variável
const btnSwitch = document.getElementById("switch")

// Adiciona um listener ao botão de switch
btnSwitch.addEventListener("click", alterarTema)

// Função para alternar o tema e salvar a preferência no Local Storage
function alterarTema() {
  const html = document.documentElement
  html.classList.toggle("light")

  // Salvar a configuração no Local Storage
  if (html.classList.contains("light")) {
    localStorage.setItem("tema", "light")
  } else {
    localStorage.setItem("tema", "dark")
  }
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
  const sistemaOperacional = navigator.userAgentData
    ? navigator.userAgentData.platform
    : platform.os.family
  document.getElementById("SO").textContent = sistemaOperacional
  return sistemaOperacional
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

  // Sanitizar o valor antes de exibir e de retornar
  const browserSanitizado = browser.replace(/[<>]/g, "").substring(0, 200)

  // Atualizar exibição no box de informações do visitante
  document.getElementById("browser").innerText = browserSanitizado

  // Retorna o browser sanitizado para enviar ao backend
  return browserSanitizado
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
function obterParametroURL(parametro) {
  try {
    const urlAtual = new URL(window.location.href)
    const urlParams = new URLSearchParams(urlAtual.search)
    const valorParametro = urlParams.get(parametro)

    if (!valorParametro) {
      return "acesso-direto"
    }

    // Sanitização básica do valor
    const valorSanitizado = valorParametro
      .trim()
      .replace(/[^a-z0-9-_]/g, "")
      .substring(0, 100)

    return valorSanitizado || "acesso-direto"
  } catch (erro) {
    console.error("Erro ao obter parâmetro da URL:", erro)
    return "acesso-direto"
  }
}

// Obter o valor do parâmetro UTM source da URL
let utmSource = obterParametroURL("utm_source")
// Exibir a origem do tráfego
if (utmSource === "acesso-direto") {
  document.getElementById("UTM").textContent = "Tráfego direto"
} else {
  document.getElementById("UTM").textContent = utmSource
}

// ======================
// Autolang
// Troca do idioma do conteúdo exibido
// Seleção e declaração de elementos HTML que serão traduzidos
const iBemVindo = document.getElementById("i-bem-vindo")
const iSuasInfos = document.getElementById("i-suas-infos")
const sProvedor = document.getElementById("s-provedor")
const sLoc = document.getElementById("s-loc")
const sSO = document.getElementById("s-so")
const sVindoDe = document.getElementById("s-vindo-de")
const fDesenvolvidoPor = document.getElementById("f-desenvolvido-por")
// O btn-portfolio já foi selecionado e salvo em btnPortfolio
const aPerfilDio = document.getElementById("a-perfil-dio")
const aRockNacional = document.getElementById("a-rock-nacional")
const utmTexto = document.getElementById("UTM")
const h2Popup = document.getElementById("h2-popup")
const pPopup = document.getElementById("p-popup")
// Os botões do popup já foram selecionados e salvos em btn-aceitar e btn-recusar

// Funções para alteração no idioma do conteúdo da página
function trocarConteudoParaEN() {
  h2Popup.textContent = "Privacy Policy"
  pPopup.innerHTML =
    'This site uses browsing data. To continue, please read and accept our <a href="privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.'
  btnAceitar.textContent = "Accept"
  btnRecusar.textContent = "Decline"
  btnPortfolio.innerHTML = '<ion-icon name="images"></ion-icon>Design Portfolio'
  aPerfilDio.innerHTML =
    '<ion-icon name="ribbon-outline"></ion-icon> Dio.me profile'
  aRockNacional.innerHTML =
    '<ion-icon name="play-circle-outline"></ion-icon>Playlist Brazilian Rock 2000'
  iBemVindo.textContent = "Welcome to my link hub!"
  iSuasInfos.textContent = "Your data:"
  sProvedor.textContent = "ISP:"
  sLoc.textContent = "Location:"
  sSO.textContent = "Operating system:"
  sVindoDe.textContent = "Referred from:"
  fDesenvolvidoPor.textContent = "Developed by Jota / José Guilherme Pandolfi"
  if (utmTexto.textContent == "Tráfego direto") {
    utmTexto.textContent = "Direct traffic"
  }
}

function trocarConteudoParaPT() {
  h2Popup.textContent = "Política de Privacidade"
  pPopup.innerHTML =
    'Este site utiliza dados de navegação. Para continuar, leia e aceite nossa <a href="privacidade.html" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>.'
  btnAceitar.textContent = "Aceitar"
  btnRecusar.textContent = "Recusar"
  btnPortfolio.innerHTML = '<ion-icon name="images"></ion-icon>Portfólio Design'
  aPerfilDio.innerHTML =
    '<ion-icon name="ribbon-outline"></ion-icon>Perfil Dio.me'
  aRockNacional.innerHTML =
    '<ion-icon name="play-circle-outline"></ion-icon>Playlist Rock 2000 Nacional'
  iBemVindo.textContent = "Bem-vindo ao meu hub de links!"
  iSuasInfos.textContent = "Suas informações:"
  sProvedor.textContent = "Provedor:"
  sLoc.textContent = "Localização:"
  sSO.textContent = "Sistema operacional:"
  sVindoDe.textContent = "Vindo de:"
  fDesenvolvidoPor.textContent =
    "Desenvolvido por Jota / José Guilherme Pandolfi"
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
      const paisOrigem = data.country_name
      const paisesPortugues = [
        "Brazil",
        "Brasil",
        "brazil",
        "brasil",
        "BR",
        "br",
        "Portugal",
        "portugal",
      ]
      if (paisesPortugues.includes(paisOrigem)) {
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
document.addEventListener("DOMContentLoaded", function () {
  obterIP()
  obterSO()
  obterBrowser()
  obterISP()
  obterLoc()
  autoAjusteIdioma()
  carregarLocalStorage()
  const monitor = new MonitorVisitante() // Backend
  monitor.iniciar() // Backend
})

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

  acompanharCarregamentoImgs()
}

// Criar a função para executar as ações desejadas para voltar aos links (estado inicial)
function fecharPortfolio() {
  divPortfolio.style.display = "none"
  divLinks.style.display = "block"

  history.replaceState(null, "", "")

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
// Barra de carregamento para acompanhar o status de carregamento das imagens do portfólio
// Função para monitorar o carregamento das imagens
function acompanharCarregamentoImgs() {
  // Seleciona todas as imagens do portfólio e descobre quantas são no total (length)
  const imagensPortfolio = document.querySelectorAll(".img-para-modal")
  const numeroDeImagensPortfolio = imagensPortfolio.length
  // Seleciona os elementos HTML da barra de carregamento
  const barraCarregamentoContainer = document.getElementById(
    "barra-carregamento-container"
  )
  const barraCarregamento = document.getElementById("barra-carregamento")

  // Inicializa o percentual de carregamento e joga o status para a barra
  let percentualCarregamento = 20
  barraCarregamento.style.width = percentualCarregamento + "%"

  // Inicializa o número de imagens carregadas na situação inicial para zero
  let numeroDeImagensCarregadas = 0

  // Para cada imagem do portfólio vamos colocar um listener de evento "load"
  imagensPortfolio.forEach((img) =>
    // Configura o event listener que deve ser inserido
    img.addEventListener("load", function () {
      // Cada vez que um imagem disparar "carregamento completo"
      // será atualizada o número total de imgs carregadas e o percentual (começa em 20%)
      numeroDeImagensCarregadas += 1
      percentualCarregamento =
        (numeroDeImagensCarregadas / numeroDeImagensPortfolio) * 80 + 20
      barraCarregamento.style.width = percentualCarregamento + "%"

      // Se todas as imagens estiverem sido carregadas, vamos sumir com a barra de carregamento
      if (numeroDeImagensCarregadas === numeroDeImagensPortfolio) {
        setTimeout(() => {
          barraCarregamento.style.display = "none"
        }, 1000)
      }
    })
  )
}

// =============
// Busca (filtro) por imagens específicas no portfólio

// Selecionando e salvando variáveis dos elementos que iremos utilizar
const barraDeBuscaPortfolio = document.getElementById(
  "barra-de-busca-portfolio"
)

// Função para exibir apenas imagens que sejam relacionadas ao input do usuário
function buscarImagensPortfolio() {
  // Puxa o que estiver escrito na barra e armazena como variável
  const termosBuscados = barraDeBuscaPortfolio.value.trim().toLowerCase()
  // Seleciona todas as divs de itens do portfólio
  const itensDoPortfolio = document.querySelectorAll(
    "#grid-portfolio .item-portfolio"
  )
  // Tomar cuidado ^ a variável acima não seleciona as imagens do portfólio, mas sim as divs container de cada uma das imagens

  // Checa se o campo de busca não está em branco (evitar bugs futuramente)
  if (termosBuscados.length === 0) {
    // Se o campo de busca estiver vazio => exibir todos os itens
    itensDoPortfolio.forEach((item) => {
      item.style.display = "block"
    })
  } else {
    itensDoPortfolio.forEach((item) => {
      const textoDoAlt = item.querySelector("img").alt.trim().toLowerCase()

      if (textoDoAlt.includes(termosBuscados)) {
        item.style.display = "block"
      } else {
        item.style.display = "none"
      }
    })
  }
}

// Acrecenta um listener na barra de busca com evento key up
barraDeBuscaPortfolio.addEventListener("keyup", buscarImagensPortfolio)

// =============
// Modal (janela flutuante) para exibir imagem do portfólio ampliada
// Identifica e seleciona a div do modal
const divModal = document.getElementById("modal")

// Obtém a imagem dentro do grid e o elemento modal que exibirá a imagem ampliada
const imgsParaModal = document.querySelectorAll(".img-para-modal")
const imgModalSrcset = document.getElementById("img-modal-srcset")
const imgModal = document.getElementById("img-modal")
const divLegendaParaModal = document.getElementById("legenda-img-modal")

// Função fechar modal pressionando ESC (será invocada logo abaixo)
const teclasModal = function (event) {
  console.log("Executou a função de teclas")
  // Verifica se o modal está visível para prosseguirmos
  if (divModal.style.display !== "none") {
    switch (event.key) {
      case "Escape":
        btnFecharModal.click() // Simula um clique no botão de fechar
        break
      case "ArrowLeft":
        btnImagemAnterior.style.display === "block" && btnImagemAnterior.click()
        break
      case "ArrowRight":
        btnImagemSeguinte.style.display === "block" && btnImagemSeguinte.click()
        break
    }
  }
}

// Para cada imagem no grid, adiciona um evento de clique
imgsParaModal.forEach((img) => {
  img.addEventListener("click", function () {
    divModal.style.display = "flex" // Exibe o modal (fundo preto que comporta tudo)
    imgModalSrcset.srcset = this.src.replace(".jpg", ".webp") // Seta o srcset da tag <source>
    imgModal.src = this.src // Seta a imagem no modal
    divLegendaParaModal.textContent = this.alt // Seta a descrição no modal
    document.body.classList.add("desativar-scroll") // Bloqueia o scroll do mouse
    botoesDeControleModal() // Chama a função de controle de botões do modal
    document.addEventListener("keydown", teclasModal) // Adiciona um listener para as teclas
    divModal.addEventListener("touchstart", iniciarToque) // Toque começa, chama a função iniciarToque
    divModal.addEventListener("touchend", finalizarToque) // Toque termina, chama a função finalizarToque
  })
})

// Identifica e seleciona o botão de fechar (X) do modal
const btnFecharModal = document.getElementById("btn-fechar-modal")

// Identifica e seleciona os botões de "Imagem anterior" e "Imagem seguinte"
const btnImagemAnterior = document.getElementById("btn-img-anterior-modal")
const btnImagemSeguinte = document.getElementById("btn-img-seguinte-modal")

// Quando o botão (X) é clicado, fecha o modal
btnFecharModal.addEventListener("click", fecharModal)

// Quando o modal for clicado, o modal também deve ser fechado
divModal.addEventListener("click", (event) => {
  // Verifica se o alvo do clique é o próprio modal e não um de seus elementos internos (filhos)
  if (event.target === divModal) {
    fecharModal()
  }
})

// Função para fechar o modal (invocada via botão X ou clique no fundo do modal)
function fecharModal() {
  divModal.style.display = "none" // Fecha o modal
  document.body.classList.remove("desativar-scroll") // Libera o scroll do fundo
  document.removeEventListener("keydown", teclasModal) // Desabilita as teclas do modal
  divModal.removeEventListener("touchstart", iniciarToque) // Desabilita monitorar o toque
  divModal.removeEventListener("touchend", finalizarToque) // Desabilita monitorar o toque
}

// Funções para botões de controle no modal
function botoesDeControleModal() {
  // Descobre qual o número da imagem do modal que foi aberta
  let numImgAbertaModal = parseInt(imgModal.src.match(/img(\d+)\.jpg$/)[1], 10)

  // Checa se existe alguma imagem antes para ser exibida
  function checarImgAnterior() {
    if (numImgAbertaModal > 1) {
      btnImagemAnterior.style.display = "block"
    } else {
      btnImagemAnterior.style.display = "none"
    }
  }

  // Checa se existe alguma imagem depois para ser exibida
  function checarImgSeguinte() {
    if (numImgAbertaModal == imgsParaModal.length) {
      btnImagemSeguinte.style.display = "none"
    } else {
      btnImagemSeguinte.style.display = "block"
    }
  }

  // Chama as funções declaradas anteriormente para mostrar/esconder os botões
  checarImgAnterior()
  checarImgSeguinte()

  // Adiciona um listener de clique no botão de Imagem Anterior com evento
  btnImagemAnterior.addEventListener("click", () => {
    // Altera a imagem exibida no modal
    imgModalSrcset.srcset =
      "./assets/imgs-portfolio/img" +
      (numImgAbertaModal - 1).toString().padStart(2, "0") +
      ".webp" // Seta o srcset da tag <source>
    imgModal.src =
      "./assets/imgs-portfolio/img" +
      (numImgAbertaModal - 1).toString().padStart(2, "0") +
      ".jpg" // Seta a imagem no modal
    // Vai até a NodeList com todas as imagens e localiza o objeto da img anterior
    const imgAnterior = imgsParaModal[numImgAbertaModal - 2] // Acessa a imagem anterior
    divLegendaParaModal.textContent = imgAnterior.alt // Seta a descrição no modal
    // Antes de mais nada, já diminui 1 no número da imagem
    numImgAbertaModal--
    // Checa novamente quais botões devem ser atualizados
    checarImgAnterior()
    checarImgSeguinte()
  })

  // Adiciona um listener de clique no botão de Imagem Anterior com evento
  btnImagemSeguinte.addEventListener("click", () => {
    // Altera a imagem exibida no modal
    imgModalSrcset.srcset =
      "./assets/imgs-portfolio/img" +
      (numImgAbertaModal + 1).toString().padStart(2, "0") +
      ".webp" // Seta o srcset da tag <source>
    imgModal.src =
      "./assets/imgs-portfolio/img" +
      (numImgAbertaModal + 1).toString().padStart(2, "0") +
      ".jpg" // Seta a imagem no modal
    // Vai até a NodeList com todas as imagens e localiza o objeto da img anterior
    const imgSeguinte = imgsParaModal[numImgAbertaModal] // Acessa a imagem anterior
    divLegendaParaModal.textContent = imgSeguinte.alt // Seta a descrição no modal
    // Antes de mais nada, já aumenta 1 no número da imagem atual
    numImgAbertaModal++
    // Checa novamente quais botões devem ser atualizados
    checarImgAnterior()
    checarImgSeguinte()
  })
}

// Arrasto de touch para trocar imagens do modal
// Variáveis para armazenar as coordenadas de início e fim do toque
let toqueInicialX = 0 // Armazena a coordenada X do ponto onde o toque começa
let toqueFinalX = 0 // Armazena a coordenada X do ponto onde o toque termina

// Função para iniciar o evento de toque
function iniciarToque(event) {
  toqueInicialX = event.touches[0].clientX // Captura a coordenada X do toque inicial
  imgModal.classList.add("efeitos-arrasto-img-modal") // Adiciona a classe para animações
}

// Função para finalizar o evento de toque
function finalizarToque(event) {
  toqueFinalX = event.changedTouches[0].clientX // Captura a coordenada X do toque final

  // Chama a função para verificar a direção do arrasto
  verificarDirecaoArrasto()

  console.log("Passou da verificação de direção do arrasto")
  // Restaura o visual da imagem para o normal
  imgModal.style.opacity = "1" // Restaura a opacidade da imagem
  imgModal.style.transform = "translateX(0)" // Restaura a posição da imagem

  // Remove a classe de transição para a próxima interação
  imgModal.classList.remove("efeitos-arrasto-img-modal")
}

// Função para verificar a direção do arrasto
function verificarDirecaoArrasto() {
  const diferencaX = toqueFinalX - toqueInicialX // Diferença entre a posição final e inicial do toque

  // Define um limite mínimo para o arrasto ser considerado
  if (Math.abs(diferencaX) > 50) {
    // 'Math.abs(diferencaX)' calcula o valor absoluto da diferença,
    // garantindo que verificamos o tamanho do movimento independentemente da direção.

    // Se a diferença for negativa (arrasto para a esquerda) e o botão "imagem seguinte" está visível
    if (diferencaX < 0 && btnImagemSeguinte.style.display !== "none") {
      imgModal.style.opacity = "0.5" // Diminui a opacidade durante o arrasto
      imgModal.style.transform = "translateX(-100%)" // Move a imagem para a esquerda
      btnImagemSeguinte.click() // Simula um clique no botão "imagem seguinte"
    }
    // Se a diferença for positiva (arrasto para a direita) e o botão "imagem anterior" está visível
    else if (diferencaX > 0 && btnImagemAnterior.style.display !== "none") {
      imgModal.style.opacity = "0.5" // Diminui a opacidade durante o arrasto
      imgModal.style.transform = "translateX(100%)" // Move a imagem para a direita
      btnImagemAnterior.click() // Simula um clique no botão "imagem anterior"
    }
  }
}

//
// Busca (filtro) por artigos específicos na lista de artigos publicados

// Selecionando e salvando variáveis dos elementos que iremos utilizar
const barraDeBuscaArtigos = document.getElementById("barra-de-busca-artigos")

// Função para exibir apenas artigos que sejam relacionados ao input do usuário
function buscarArtigos() {
  // Puxa o que estiver escrito na barra e armazena como variável
  const termosBuscados = barraDeBuscaArtigos.value.trim().toLowerCase()
  // Seleciona todas as divs de itens do portfólio
  const itensDaListaDeArtigos = document.querySelectorAll(
    "#container-artigos ul li a"
  )
  // Tomar cuidado ^ a variável acima não seleciona as imagens do portfólio, mas sim as divs container de cada uma das imagens

  // Checa se o campo de busca não está em branco (evitar bugs futuramente)
  if (termosBuscados.length === 0) {
    // Se o campo de busca estiver vazio => exibir todos os itens
    itensDaListaDeArtigos.forEach((item) => {
      item.style.display = "block"
    })
  } else {
    itensDaListaDeArtigos.forEach((item) => {
      const textoDoLink = item.textContent.toLowerCase()

      if (textoDoLink.includes(termosBuscados)) {
        item.style.display = "block"
      } else {
        item.style.display = "none"
      }
    })
  }
}

// Acrecenta um listener na barra de busca com evento key up
barraDeBuscaArtigos.addEventListener("keyup", buscarArtigos)

// Recurso para exibir e ocultar a lista de artigos
// Identificar e selecionar o botão utilizado para acessar a lista de artigos
const btnArtigos = document.getElementById("btn-artigos")

// Identificar e selecionar o botão utilizado para voltar aos links (estado inicial)
const btnVoltarDeArtigosParaLinks = document.getElementById(
  "btn-voltar-de-artigos-para-links"
)

// Identificar e selecionar os containers que devem ser exibidos/ocultados
// (variável divLinks já foi obtida no trecho de código de exibir/ocultar portfólio de imagens)
const divArtigos = document.getElementById("container-artigos")

// Criar a função para executar as ações desejadas para abertura do portfólio
function abrirArtigos() {
  divLinks.style.display = "none"
  divArtigos.style.display = "block"

  history.replaceState(null, "Meus Artigos Publicados", "/meus-artigos")
}

// Criar a função para executar as ações desejadas para voltar aos links (estado inicial)
function fecharArtigos() {
  divArtigos.style.display = "none"
  divLinks.style.display = "block"

  history.replaceState(null, "", "")

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Adicionar um listener de clique no botão para ir ao portfólio de design
btnArtigos.addEventListener("click", () => {
  abrirArtigos()
})

// Adicionar um listener de clique no botão para voltar aos links (estado inicial)
btnVoltarDeArtigosParaLinks.addEventListener("click", () => {
  fecharArtigos()
})

// =============
// Política de privacidade
// Seleciona os botões de Aceitar e Recusar
const btnAceitar = document.getElementById("btn-aceitar")
const btnRecusar = document.getElementById("btn-recusar")

// Adiciona os listeners para os botões de "Aceitar" e de "Recusar"
btnAceitar.addEventListener("click", aceitar)
btnRecusar.addEventListener("click", recusar)

// Funções para os botões do pop-up sobre política de privacidade
function aceitar() {
  // Remove o pop-up da página e permite a navegação normal
  document.getElementById("popup-container").style.display = "none"
  localStorage.setItem("politicaDePrivacidade", "aceita") // Salvar no Local Storage
}

function recusar() {
  // Redireciona o usuário para fora do site
  localStorage.setItem("politicaDePrivacidade", "aceita") // Salvar no Local Storage
  window.location.href = "https://www.google.com"
}

// =============
// Local Storage
// Carregar as preferências salvas no local storage
function carregarLocalStorage() {
  // Política de Privacidade já foi aceita?
  const politicaDePrivacidade = localStorage.getItem("politicaDePrivacidade")
  if (politicaDePrivacidade === "aceita") {
    document.getElementById("popup-container").style.display = "none"
  }
  // Tema salvo
  const temaSalvo = localStorage.getItem("tema")
  if (temaSalvo === "light") {
    document.documentElement.classList.add("light")
  } else {
    document.documentElement.classList.remove("light")
  }
}

// =============
// BACKEND
// Envio de estatísticas para o banco de dados

class MonitorVisitante {
  #configuracao = {
    urlApi: "https://hub-de-links.onrender.com",
    intervaloAtualizacao: 2000,
    maxTentativas: 3,
    atrasoTentativa: 1000,
  }

  #estado = {
    idVisitante: "",
    horarioInicio: null,
    cliques: 0,
    cliquesValidos: 0,
    ultimaAtualizacao: null,
    atualizacaoPendente: false,
  }

  constructor() {
    this.#estado.horarioInicio = new Date()
    this.#estado.idVisitante = this.#gerarIdVisitante()
  }

  async iniciar() {
    try {
      await this.#registrarVisitante()
      this.#iniciarMonitoramento()
      console.log("✅ Monitoramento de visitante iniciado com sucesso")
    } catch (erro) {
      console.error("❌ Erro ao iniciar monitoramento:", erro)
    }
  }

  #gerarIdVisitante() {
    const timestamp = Date.now().toString()
    const bytesAleatorios = new Uint8Array(6)
    crypto.getRandomValues(bytesAleatorios)
    const hexAleatorio = Array.from(bytesAleatorios)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 9)
    return `v_${timestamp}_${hexAleatorio}`
  }

  #formatadores = {
    data: new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),

    hora: new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),

    duracao: (segundos) => {
      let minutos = Math.floor(segundos / 60)
      let segundosRestantes = segundos % 60

      // Garante que minutos e segundos não ultrapassem os valores máximos para cada
      minutos = minutos > 99 ? 99 : minutos
      segundosRestantes = segundosRestantes > 59 ? 59 : segundosRestantes

      // Formata a string com padding de zeros à esquerda
      return `${minutos.toString().padStart(2, "0")} min ${segundosRestantes
        .toString()
        .padStart(2, "0")} s`
    },
  }

  #validadores = {
    idVisitante: (id) => /^v_\d{13}_[a-f0-9]{9}$/.test(id),

    dados: (dados) => {
      const camposObrigatorios = [
        "idVisitante",
        "timestampInicio",
        "dataAcessoBr",
        "horaAcessoBr",
      ]
      return camposObrigatorios.every((campo) => dados[campo])
    },
  }

  #sanitizarTexto(texto) {
    if (!texto) return ""
    return texto
      .replace(/[<>'"&]/g, "")
      .trim()
      .toWellFormedString()
      .slice(0, 200)
  }

  #detectarSistema() {
    const navegador = navigator.userAgent
    const plataforma = navigator.platform
    return {
      sistemaOperacional: this.#sanitizarTexto(plataforma),
      navegador: this.#sanitizarTexto(navegador.split(" ").pop()),
    }
  }

  #obterFonteUtm() {
    try {
      const utmSource = new URLSearchParams(window.location.search).get(
        "utm_source"
      )
      return this.#sanitizarTexto(utmSource) || "acesso-direto"
    } catch {
      return "acesso-direto"
    }
  }

  async #registrarVisitante() {
    const sistema = this.#detectarSistema()
    const dadosVisitante = {
      visitor_id: this.#estado.idVisitante,
      timestamp_inicio: this.#estado.horarioInicio.toISOString(),
      data_acesso_br: this.#formatadores.data.format(
        this.#estado.horarioInicio
      ),
      hora_acesso_br: this.#formatadores.hora.format(
        this.#estado.horarioInicio
      ),
      sistema_operacional: sistema.sistemaOperacional,
      navegador: sistema.navegador,
      utm_source: this.#obterFonteUtm(),
      total_cliques: 0,
      cliques_validos: 0,
      tempo_permanencia: "00 min 00 s",
    }

    if (!this.#validadores.idVisitante(dadosVisitante.visitor_id)) {
      throw new Error("Formato do ID do visitante inválido")
    }

    const resposta = await this.#fazerRequisicao("/registrar-visitante", {
      method: "POST",
      body: dadosVisitante,
    })

    if (!resposta.ok) {
      throw new Error("Falha ao registrar visitante")
    }
  }

  #iniciarMonitoramento() {
    this.#monitorarCliques()
    this.#monitorarTempoPermanencia()
  }

  #monitorarCliques() {
    document.addEventListener("click", async (evento) => {
      this.#estado.cliques++

      const elementosClicaveis = new Set(["A", "BUTTON", "INPUT", "SELECT"])
      if (elementosClicaveis.has(evento.target.tagName)) {
        this.#estado.cliquesValidos++
      }

      if (!this.#estado.atualizacaoPendente) {
        this.#estado.atualizacaoPendente = true
        await this.#atualizacaoComDelay()
      }
    })
  }

  #monitorarTempoPermanencia() {
    window.addEventListener("beforeunload", async () => {
      const duracao = Math.floor(
        (Date.now() - this.#estado.horarioInicio) / 1000
      )
      await this.#atualizarDadosVisitante(this.#formatadores.duracao(duracao))
    })
  }

  async #fazerRequisicao(endpoint, opcoes = {}) {
    const url = `${this.#configuracao.urlApi}${endpoint}`
    let tentativas = 0

    while (tentativas < this.#configuracao.maxTentativas) {
      try {
        return await fetch(url, {
          ...opcoes,
          headers: {
            "Content-Type": "application/json",
            ...opcoes.headers,
          },
          body: opcoes.body ? JSON.stringify(opcoes.body) : undefined,
        })
      } catch (erro) {
        tentativas++
        if (tentativas === this.#configuracao.maxTentativas) throw erro
        await new Promise((resolve) =>
          setTimeout(resolve, this.#configuracao.atrasoTentativa)
        )
      }
    }
  }

  #atualizacaoComDelay = debounce(async () => {
    try {
      const duracao = Math.floor(
        (Date.now() - this.#estado.horarioInicio) / 1000
      )
      await this.#atualizarDadosVisitante(this.#formatadores.duracao(duracao))
    } finally {
      this.#estado.atualizacaoPendente = false
    }
  }, this.#configuracao.intervaloAtualizacao)

  async #atualizarDadosVisitante(tempoPermanencia = "00 min 00 s") {
    const dadosAtualizacao = {
      total_cliques: this.#estado.cliques,
      cliques_validos: this.#estado.cliquesValidos,
      tempo_permanencia: tempoPermanencia,
    }

    await this.#fazerRequisicao(
      `/atualizar-visitante/${this.#estado.idVisitante}`,
      {
        method: "PUT",
        body: dadosAtualizacao,
      }
    )
  }
}

function debounce(funcao, atraso) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => funcao.apply(this, args), atraso)
  }
}

// Desenvolvido por Jota / José Guilherme Pandolfi

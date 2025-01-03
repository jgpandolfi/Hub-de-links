<h1 align="center"> Hub de Links - Jota </h1>

<p align="center">
Projeto de front-end desenvolvido e utilizado por mim como um hub de links em minhas redes sociais, redirecionando para páginas de portfólio, meu site, entre outros links pertinentes. Inicialmente, esse projeto foi baseado no projeto DevLinks do curso "Discover" da Rocketseat.
</p>

## 🌎 Acesse e confira on-line

<p>Meu Hub de Links está disponível on-line através da URL: <a href="https://hub.agenciam2a.com.br/?utm_source=GitHub" target="_blank" rel="noopener noreferrer">https://hub.agenciam2a.com.br/</a></p>
<p>Aproveite e confira meu trabalho! 😊</p>

## 💻 Sobre o Projeto

<p>Esse projeto surgiu a partir da junção da minha necessidade pessoal em contar com uma plataforma web que servisse como ponto de encontro de tráfego de diferentes redes sociais que pudesse redirecionar os visitantes a links pertinentes (similar a um "LinkTree") e a vontade de exercitar meus conhecimentos em desenvolvimento web, mais especificamente no front-end.</p>

<p>Além de ter sido desenvolvido para uso próprio, sanando uma necessidade real, o projeto me proporcionou aprendizagem prática envolvendo HTML, CSS e JavaScript.</p>

<p>Também foi possível exercitar o uso de ferramentas como o Git, GitHub e Figma.</p>

## 🚀 Tecnologias

<p>Esse projeto foi desenvolvido com o uso das seguintes tecnologias:</p>

<ul>
<li>Figma</li>
<li>HTML</li>
<li>CSS</li>
<li>JavaScript</li>
<li>Node.JS</li>
<li>Fastify</li>
<li>PostgreeSQL</li>
<li>Git e Github</li>
</ul>

<p>No âmbito das tecnologias anteriores, foram utilizados os seguintes recursos e práticas:</p>
<p>Front-end:</p>
<ul>
<li>Media queries</li>
<li>Animações e efeitos em CSS</li>
<li>Conceito de SPA (<i>Single Page Application</i>)</li>
<li>Roteamento de páginas</li>
<li>Integração com APIs de terceiros</li>
<li>Imagens otimizadas em Webp</li>
<li>Lazy loading em imagens</li>
<li>Práticas de SEO (<i>Search Engine Optimization</i>)</li>
<li>Verificação do ambiente do usuário (biblioteca platform  e navigator.userAgent)</li>
<li>Manipulação de CSS via JavaScript</li>
<li>Uso de funções condicionais para responsividade</li>
<li>Manipulação dinâmica do DOM</li>
<li>Organização modular de funções recorrentes</li>
<li>Uso de expressões regulares (Regex)</li>
<li>Gerenciamento de estado com classes CSS</li>
<li>catch() e fetch() para tratamento de erros</li>
</ul>

<p>Back-end:</p>
<ul>
<li>Fastify: Framework web rápido, escalável e moderno, utilizado como base do servidor</li>
<li>@fastify/cors: Gerenciamento avançado de CORS (Cross-Origin Resource Sharing)</li>
<li>@fastify/rate-limit: Controle de taxa de requisições e proteção contra ataques DDoS</li>
<li>dotenv: Gerenciamento de variáveis de ambiente</li>
<li>PostgreeSQL como banco de dados</li>
<li>Arquitetura REST</li>
<li>Axios: Cliente HTTP para requisições externas</li>
<li>Pool de conexões para banco de dados</li>
<li>Tratamento robusto de erros</li>
<li>Logs detalhados de console</li>
<li>Verificação e criação automática de tabelas no banco de dados</li>
<li>Sanitização avançada de dados com sanitize-html</li>
<li>Validação e limpeza avançadas de dados com Joi</li>
<li>Código modular e organizado</li>
<li>Debouncing: Otimização de requisições frequentes</li>
<li>Retry Pattern: Tentativas múltiplas em caso de falha</li>
<li>Consumo de APIs externas com Fallback</li>
<li>Uso de status codes HTTP apropriados para cada situação</li>
</ul>

## 💻 Recursos e funcionalidades

<p>🟢 Já implementado:</p>
<ul>
<li><b>Responsividade:</b> layout adaptativo a diferentes telas e dispositivos</li>
<li><b>Modo escuro/claro:</b> o visitante pode ajustar a luminosidade entre os dois modos</li>
<li><b>Plano de fundo animado:</b> imagem de fundo dinâmica</li>
<li><b>Box de dados do visitante:</b> são exibidas informações como IP, endereço físico local, provedor, etc</li>
<li><b>Microsoft Clarity, Hotjar e PostHog:</b> acompanhamento de acessos e do uso do produto</li>
<li><b>Ajuste manual de idioma português/inglês:</b> o visitante é capaz de alternar os idiomas</li>
<li><b>Portfólio de imagens (SPA):</b> há um portfólio dinâmico com imagens de design gráfico</li>
<li><b>Avisos legais sobre dados:</b> pop-up com dizeres compatíveis com a LGPD e páginas de política de privacidade</li>
<li><b>Ajuste automático de idioma:</b> falantes de português seriam ajustados automaticamente para esse idioma, os demais para o inglês</li>
<li><b>Barra de carregamento:</b> ao trocar o status da SPA, utilizar barra de carregamento para indicar o status do sistema (heurística de Nielsen)</li>
<li><b>Botões (e teclas) de navegação no modal do portfólio de design:</b> troque facilmente entre as imagens com o modal aberto
<li><b>Barra de pesquisa no portfólio de imagens:</b> para facilitar a busca por imagens relacionadas a segmentos específicos</li>
<li><b>Preferências de usuário salvas no Local Storage:</b> o tema de preferência do usuário é salvo no local storage, para maior comodidade</li>
<li><b>Traqueamento (tracking) próprio de insights dos visitantes da página web:</b> armazenamento de dados dos visitantes da página web em banco de dados e backend próprios</li>
<li><b>Programa para geração de relatórios de insghts:</b> programa em Node.JS separado do servidor para geração de relatórios em .txt dos insights do banco de dados próprio sobre os visitantes</li>
</ul>

<p>🟡 Em desenvolvimento:</p>
<ul>
</ul>

<p>🔴 Não iniciado:</p>
<ul>
<li><b>Ambiente do administrador:</b> aplicação web para que o administrador do sistema possa acessar e visualizar os dados armazenados dos visitates da página web</li>
<li><b>Facebook Pixel:</b> para eventuais campanhas de anúncios pagos</li>
<li><b>Google Tag Manager e Google Analytics:</b> para melhor acompanhamento da experiência do usuário</li>
<li><b>Botão e página (em SPA) de projetos:</b> para que o usuário possa conhecer outros projetos de desenvolvimento web que estou empenhado</li>
</ul>

## :memo: Licença

Esse projeto está sob a licença MIT.

<p align="center">
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=49AA26&labelColor=000000">
</p>

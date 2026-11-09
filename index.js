const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const empresas = {
  marvel: {
    nome: 'Marvel',
    descricao: 'Conheça alguns heróis do universo Marvel.',
    personagens: ['Thor', 'Homem de Ferro'],
  },
  dc: {
    nome: 'DC',
    descricao: 'Conheça alguns heróis do universo DC.',
    personagens: ['Batman', 'Superman'],
  },
};

function escaparHtml(valor) {
  return String(valor).replace(/[&<>"']/g, (caractere) => {
    const entidades = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entidades[caractere];
  });
}

function criarLinkPersonagem(empresa, nome) {
  const url = `/personagem/${encodeURIComponent(empresa)}/${encodeURIComponent(nome)}`;
  return `<li class="collection-item"><a href="${url}">${escaparHtml(nome)}</a></li>`;
}

function criarLayout(titulo, conteudo) {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${titulo}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
  </head>
  <body class="blue-grey lighten-5">
    <nav class="blue-grey darken-3">
      <div class="nav-wrapper container">
        <a href="/" class="brand-logo">Catálogo de Heróis</a>
        <ul class="right">
          <li><a href="/marvel">Marvel</a></li>
          <li><a href="/dc">DC</a></li>
        </ul>
      </div>
    </nav>
    <main class="container section">
      ${conteudo}
    </main>
  </body>
</html>`;
}

app.get('/', (req, res) => {
  const cardsEmpresas = Object.entries(empresas)
    .map(([empresa, dados]) => {
      const linksPersonagens = dados.personagens
        .map((nome) => criarLinkPersonagem(empresa, nome))
        .join('\n');

      return `<div class="col s12 m6">
        <div class="card">
          <div class="card-content">
            <span class="card-title">${dados.nome}</span>
            <p>${dados.descricao}</p>
            <ul class="collection">${linksPersonagens}</ul>
          </div>
          <div class="card-action">
            <a href="/${empresa}">Ver todos de ${dados.nome}</a>
          </div>
        </div>
      </div>`;
    })
    .join('\n');

  res.send(criarLayout('Catálogo de Heróis', `<div class="center-align section">
      <h1>Catálogo de Heróis</h1>
      <p class="flow-text">Bem-vindo ao catálogo de heróis da Marvel e da DC!</p>
    </div>
    <div class="row">${cardsEmpresas}</div>`));
});

for (const [empresa, dados] of Object.entries(empresas)) {
  app.get(`/${empresa}`, (req, res) => {
    const linksPersonagens = dados.personagens
      .map((nome) => `<a class="collection-item" href="/personagem/${encodeURIComponent(empresa)}/${encodeURIComponent(nome)}">${escaparHtml(nome)}</a>`)
      .join('\n');

    res.send(criarLayout(dados.nome, `<div class="row">
      <div class="col s12">
        <div class="card">
          <div class="card-content">
            <span class="card-title">${dados.nome}</span>
            <p class="flow-text">${dados.descricao}</p>
            <h5>Personagens disponíveis</h5>
            <div class="collection">${linksPersonagens}</div>
          </div>
          <div class="card-action">
            <a href="/">Voltar à página inicial</a>
          </div>
        </div>
      </div>
    </div>`));
  });
}

app.get('/personagem/:empresa/:nome', (req, res) => {
  const { empresa, nome } = req.params;

  res.send(criarLayout(`${escaparHtml(nome)} - ${escaparHtml(empresa)}`, `<div class="row">
      <div class="col s12 m8 offset-m2">
        <div class="card">
          <div class="card-content">
            <span class="card-title">${escaparHtml(nome)}</span>
            <p class="flow-text">Empresa: ${escaparHtml(empresa)}</p>
          </div>
          <div class="card-action">
            <a href="/">Voltar à página inicial</a>
          </div>
        </div>
      </div>
    </div>`));
});

app.listen(port, () => {
  console.log(`Servidor disponível em http://localhost:${port}`);
});
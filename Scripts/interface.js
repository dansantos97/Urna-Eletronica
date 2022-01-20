const seuVotoPara = document.querySelector(".d_1_1 span");
const cargo = document.querySelector(".d_1_2 span");
const numeros = document.querySelector(".d_1_3");
const informacoes = document.querySelector(".d_1_4");
const avisos = document.querySelector(".d_2");
const imagens = document.querySelector(".d_1_right");

let etapaAtual = 0;
let numero = "";
let votoBranco = false;
let votos = [];

function iniciarVoto() {
  let etapa = etapas[etapaAtual];

  let numeroHtml = "";
  numero = "";
  votoBranco = false;

  for (let i = 0; i < etapa.numeros; i++) {
    if (i === 0) {
      numeroHtml += '<div class="numero pisca"></div>';
    } else {
      numeroHtml += '<div class="numero"></div>';
    }
  }

  seuVotoPara.style.display = "none";
  cargo.innerHTML = etapa.cargo;
  informacoes.innerHTML = "";
  avisos.style.display = "none";
  imagens.innerHTML = "";
  numeros.innerHTML = numeroHtml;
}

function atualizaInterface() {
  let etapa = etapas[etapaAtual];

  let candidato = etapa.candidatos.filter((item) => {
    if (item.numero === numero) {
      return true;
    } else {
      return false;
    }
  });

  if (candidato.length > 0) {
    candidato = candidato[0];
    seuVotoPara.style.display = "block";
    avisos.style.display = "block";
    informacoes.innerHTML = `Nome: ${candidato.nome}<br>Partido: ${candidato.partido}`;

    let fotosHtml = "";
    for (let i in candidato.fotos) {
      if (candidato.fotos[i].small) {
        fotosHtml += `<div class="d_1_image small"><img src="${candidato.fotos[i].url}" height="100px">${candidato.fotos[i].legenda}</div>`;
      } else {
        fotosHtml += `<div class="d_1_image"><img src="${candidato.fotos[i].url}" height="120px" width="70px">${candidato.fotos[i].legenda}</div>`;
      }
    }

    imagens.innerHTML = fotosHtml;
  } else {
    seuVotoPara.style.display = "block";
    avisos.style.display = "block";
    informacoes.innerHTML = '<div class="aviso_grande pisca">VOTO NULO</div>';
  }
}

function clicou(n) {
  let digito = document.querySelector(".numero.pisca");
  if (digito !== null) {
    digito.innerHTML = n;
    numero = `${numero}${n}`;

    digito.classList.remove("pisca");
    if (digito.nextElementSibling !== null) {
      digito.nextElementSibling.classList.add("pisca");
    } else {
      atualizaInterface();
    }

    new Audio("./Assets/audios/audio1.mp3").play();
  }
}

function branco() {
  new Audio("./Assets/audios/audio1.mp3").play();

  numero = "";
  votoBranco = true;
  seuVotoPara.style.display = "block";
  avisos.style.display = "block";
  numeros.innerHTML = "";
  informacoes.innerHTML =
    '<div class="aviso_grande pisca">VOTO EM BRANCO</div>';
}

function corrige() {
  new Audio("./Assets/audios/audio2.mp3").play();
  iniciarVoto();
}

function confirma() {
  let etapa = etapas[etapaAtual];

  let votoConfirmado = false;

  if (votoBranco === true) {
    votoConfirmado = true;
    votos.push({
      etapa: etapas[etapaAtual].cargo,
      voto: "Branco",
    });
  } else if (numero.length === etapa.numeros) {
    votoConfirmado = true;
    votos.push({
      etapa: etapas[etapaAtual].cargo,
      voto: numero,
    });
  }

  if (sessionStorage.getItem(numero) !== null) {
    let total = parseInt(sessionStorage.getItem(numero)) + 1;
    sessionStorage.setItem(numero, total);
  } else {
    sessionStorage.setItem(numero, 1);
  }

  if (votoConfirmado) {
    etapaAtual++;
    if (etapas[etapaAtual] !== undefined) {
      iniciarVoto();
    } else {
      document.querySelector(".tela").innerHTML =
        '<div class="fim pisca">FIM</div>';
      console.log(votos);
    }
  }

  new Audio("./Assets/audios/audio3.mp3").play();
}

function resultado() {
  document.getElementById("resultado").innerHTML = "";
  for (i = 0; i < 100000; i++) {
    if (sessionStorage.getItem(i) !== null) {
      document.getElementById("resultado").innerHTML +=
        "O candidato " + i + " tem " + sessionStorage.getItem(i) + " votos<br>";
    }
  }
}

iniciarVoto();

const fases = [
  {
    texto: "A sala está escura. Há uma vela apagada, uma caixa de fósforos e uma porta trancada. O bilhete diz: 'Eu existo quando tudo desaparece.'",
    dica: "Aparece quando não há luz.",
    resposta: "escuro"
  },
  {
    texto: "Na mesa existe um copo com água pela metade. Ao lado dele, uma mensagem: 'Quanto mais eu tiro, maior eu fico.'",
    dica: "Aumenta quando algo é removido.",
    resposta: "buraco"
  },
  {
    texto: "O relógio parou às 03:00. No chão, há três letras: L U Z. A porta final pede a palavra contrária.",
    dica: "O contrário de luz.",
    resposta: "sombra"
  },
  {
    texto: "Um bilhete diz: 'Tenho cidades, mas não casas. Tenho rios, mas não água. Tenho estradas, mas ninguém anda por mim.'",
    dica: "Você consulta para encontrar lugares.",
    resposta: "mapa"
  },
  {
    texto: "A gaveta contém uma chave, mas nenhuma fechadura. O investigador percebe: a chave não abre portas, abre respostas.",
    dica: "É uma informação que resolve algo.",
    resposta: "pista"
  },
  {
    texto: "Na parede está escrito: 'Falo sem boca e respondo sem corpo.'",
    dica: "Você ouve depois de gritar em um lugar vazio.",
    resposta: "eco"
  }
];

const telaInicial = document.getElementById("telaInicial");
const telaJogo = document.getElementById("telaJogo");
const telaFinal = document.getElementById("telaFinal");

const btnIniciar = document.getElementById("btnIniciar");
const btnReiniciar = document.getElementById("btnReiniciar");
const btnJogarNovamente = document.getElementById("btnJogarNovamente");

const faseTexto = document.getElementById("faseTexto");
const dicaTexto = document.getElementById("dicaTexto");
const faseAtual = document.getElementById("faseAtual");
const pontuacaoTexto = document.getElementById("pontuacao");
const vidasTexto = document.getElementById("vidas");
const timerTexto = document.getElementById("timer");

const formResposta = document.getElementById("formResposta");
const inputResposta = document.getElementById("resposta");
const mensagem = document.getElementById("mensagem");

const tituloFinal = document.getElementById("tituloFinal");
const textoFinal = document.getElementById("textoFinal");
const rankingLista = document.getElementById("ranking");

let faseIndex = 0;
let pontos = 0;
let vidas = 3;
let tempo = 30;
let intervalo;

btnIniciar.addEventListener("click", iniciarJogo);
btnReiniciar.addEventListener("click", reiniciarJogo);
btnJogarNovamente.addEventListener("click", reiniciarJogo);

formResposta.addEventListener("submit", function(event) {
  event.preventDefault();

  const respostaUsuario = inputResposta.value.trim().toLowerCase();
  const respostaCorreta = fases[faseIndex].resposta.toLowerCase();

  if (respostaUsuario === respostaCorreta) {
    tocarSomCerto();
    pontos += 10 + tempo;

    mensagem.textContent = "Resposta correta. A próxima porta se abriu.";
    mensagem.className = "certo";

    faseIndex++;
    inputResposta.value = "";

    setTimeout(() => {
      if (faseIndex < fases.length) {
        carregarFase();
      } else {
        finalizarJogo(true);
      }
    }, 900);

  } else {
    tocarSomErro();
    vidas--;

    mensagem.textContent = "Resposta incorreta. Uma vida foi perdida.";
    mensagem.className = "errado";

    atualizarInterface();

    if (vidas <= 0) {
      finalizarJogo(false);
    }
  }
});

function iniciarJogo() {
  faseIndex = 0;
  pontos = 0;
  vidas = 3;

  telaInicial.classList.add("hidden");
  telaFinal.classList.add("hidden");
  telaJogo.classList.remove("hidden");

  carregarFase();
}

function carregarFase() {
  clearInterval(intervalo);

  tempo = 30;
  mensagem.textContent = "";
  inputResposta.value = "";

  const fase = fases[faseIndex];

  faseTexto.textContent = fase.texto;
  dicaTexto.textContent = fase.dica;

  atualizarInterface();
  iniciarTimer();
}

function iniciarTimer() {
  intervalo = setInterval(() => {
    tempo--;
    atualizarInterface();

    if (tempo <= 0) {
      clearInterval(intervalo);
      vidas--;
      tocarSomErro();

      mensagem.textContent = "O tempo acabou. Uma vida foi perdida.";
      mensagem.className = "errado";

      if (vidas <= 0) {
        finalizarJogo(false);
      } else {
        setTimeout(carregarFase, 900);
      }
    }
  }, 1000);
}

function atualizarInterface() {
  faseAtual.textContent = `Fase ${faseIndex + 1} de ${fases.length}`;
  pontuacaoTexto.textContent = `Pontuação: ${pontos}`;
  vidasTexto.textContent = `Vidas: ${"❤".repeat(vidas)}`;
  timerTexto.textContent = `Tempo: ${tempo}s`;
}

function finalizarJogo(venceu) {
  clearInterval(intervalo);

  telaJogo.classList.add("hidden");
  telaFinal.classList.remove("hidden");

  if (venceu) {
    tituloFinal.textContent = "Caso Resolvido";
    textoFinal.textContent = `Você concluiu a investigação com ${pontos} pontos.`;
  } else {
    tituloFinal.textContent = "Caso Arquivado";
    textoFinal.textContent = `A investigação terminou com ${pontos} pontos.`;
  }

  salvarRanking(pontos);
  mostrarRanking();
}

function reiniciarJogo() {
  clearInterval(intervalo);

  telaFinal.classList.add("hidden");
  telaJogo.classList.remove("hidden");
  telaInicial.classList.add("hidden");

  faseIndex = 0;
  pontos = 0;
  vidas = 3;

  carregarFase();
}

function salvarRanking(pontuacao) {
  const ranking = JSON.parse(localStorage.getItem("rankingMiniEnigma")) || [];

  const novoRegistro = {
    pontos: pontuacao,
    data: new Date().toLocaleDateString("pt-BR")
  };

  ranking.push(novoRegistro);

  ranking.sort((a, b) => b.pontos - a.pontos);

  const topCinco = ranking.slice(0, 5);

  localStorage.setItem("rankingMiniEnigma", JSON.stringify(topCinco));
}

function mostrarRanking() {
  const ranking = JSON.parse(localStorage.getItem("rankingMiniEnigma")) || [];

  rankingLista.innerHTML = "";

  ranking.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}º lugar - ${item.pontos} pontos - ${item.data}`;
    rankingLista.appendChild(li);
  });
}

function tocarSomCerto() {
  const audio = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
  audio.volume = 0.25;
  audio.play();
}

function tocarSomErro() {
  const audio = new Audio("https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg");
  audio.volume = 0.25;
  audio.play();
}
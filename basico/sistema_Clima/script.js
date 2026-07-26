const form = document.getElementById("formClima");
const cidadeInput = document.getElementById("cidade");

const resultado = document.getElementById("resultado");
const nomeCidade = document.getElementById("nomeCidade");
const temperatura = document.getElementById("temperatura");
const umidade = document.getElementById("umidade");
const chuva = document.getElementById("chuva");
const statusPlantacao = document.getElementById("statusPlantacao");

form.addEventListener("submit", async function(event) {
  event.preventDefault();

  const cidade = cidadeInput.value.trim();

  if (cidade === "") {
    alert("Digite uma cidade.");
    return;
  }

  buscarClima(cidade);
});

async function buscarClima(cidade) {
  try {
    const urlLocalizacao = `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=1&language=pt&format=json`;

    const respostaLocalizacao = await fetch(urlLocalizacao);
    const dadosLocalizacao = await respostaLocalizacao.json();

    if (!dadosLocalizacao.results) {
      alert("Cidade não encontrada.");
      return;
    }

    const local = dadosLocalizacao.results[0];

    const latitude = local.latitude;
    const longitude = local.longitude;

    const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=auto`;

    const respostaClima = await fetch(urlClima);
    const dadosClima = await respostaClima.json();

    const climaAtual = dadosClima.current;

    nomeCidade.textContent = `${local.name}, ${local.country}`;
    temperatura.textContent = `${climaAtual.temperature_2m}°C`;
    umidade.textContent = `${climaAtual.relative_humidity_2m}%`;
    chuva.textContent = `${climaAtual.precipitation} mm`;

    atualizarStatusPlantacao(
      climaAtual.temperature_2m,
      climaAtual.relative_humidity_2m,
      climaAtual.precipitation
    );

    resultado.classList.remove("hidden");

  } catch (error) {
    alert("Erro ao buscar o clima.");
    console.log(error);
  }
}

function atualizarStatusPlantacao(temp, umid, chuvaAtual) {
  statusPlantacao.className = "status";

  if (chuvaAtual > 5) {
    statusPlantacao.textContent = "🔴 Atenção: chuva forte. Risco para plantação e solo encharcado.";
    statusPlantacao.classList.add("ruim");
  } else if (umid < 40 || temp > 32) {
    statusPlantacao.textContent = "🟡 Atenção: clima seco ou muito quente. Verifique irrigação.";
    statusPlantacao.classList.add("atencao");
  } else {
    statusPlantacao.textContent = "🟢 Clima favorável para a plantação.";
    statusPlantacao.classList.add("bom");
  }
}
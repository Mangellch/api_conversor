const apiUrl = "https://mindicador.cl/api";
const montoInput = document.getElementById("monto");
const monedaSelect = document.getElementById("moneda");
const resultado = document.getElementById("resultado");
const buscarBtn = document.getElementById("buscar");
const ctx = document.getElementById("grafico").getContext("2d");

let grafico = null; // almacena el gráfico

// monedas disponibles
async function cargarMonedas() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Llenar el select con las monedas
    const monedas = ["dolar", "euro"]; // Monedas a mostrar
    monedas.forEach((moneda) => {
      const option = document.createElement("option");
      option.value = moneda;
      option.textContent = data[moneda].nombre;
      monedaSelect.appendChild(option);
    });
  } catch (error) {
    resultado.textContent = `Error al cargar monedas: ${error.message}`;
  }
}

// conversión
async function convertirMoneda() {
  const monto = parseFloat(montoInput.value);
  const moneda = monedaSelect.value;

  if (!monto || !moneda) {
    resultado.textContent = "Por favor, ingrese un monto y seleccione una moneda.";
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/${moneda}`);
    const data = await response.json();

    const valorActual = data.serie[0].valor; // Último valor de la moneda
    const conversion = (monto / valorActual).toFixed(2);

    // resultado 
    resultado.textContent = `Resultado: ${conversion} ${data.nombre}`;

    // gráfico
    dibujarGrafico(data);
  } catch (error) {
    resultado.textContent = `Error al realizar la conversión: ${error.message}`;
  }
}

// 
// gráfico con Chart.js
function dibujarGrafico(data) {
  const fechas = data.serie.slice(0, 10).map((item) => item.fecha.split("T")[0]).reverse();
  const valores = data.serie.slice(0, 10).map((item) => item.valor).reverse();

  // borrar gráfico anterior
  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(ctx, {
    type: "line",
    data: {
      labels: fechas,
      datasets: [{
        label: `Historial últimos 10 días (${data.nombre})`,
        data: valores,
        borderColor: "rgba(0, 207, 255, 1)",
        backgroundColor: "rgba(0, 207, 255, 0.2)",
        borderWidth: 2,
        fill: true
      }]
    }
  });
}

// Evento
buscarBtn.addEventListener("click", convertirMoneda);

cargarMonedas();

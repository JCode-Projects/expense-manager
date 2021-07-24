// Variables
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");


// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
    document.addEventListener("submit", agregarGasto);
}

// Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = presupuesto;
        this.restante = presupuesto;
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id != id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        const { presupuesto, restante } = cantidad;
        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        const divAlerta = document.createElement("div");
        divAlerta.classList.add("text-center", "alert");

        if(tipo === "error") {
            divAlerta.classList.add("alert-danger");
        } else {
            divAlerta.classList.add("alert-success");
        }

        divAlerta.textContent = mensaje;

        if(document.querySelectorAll(".alert-danger").length <= 2) {  
            document.querySelector(".primario").insertBefore(divAlerta, formulario);

            setTimeout(() => {
                divAlerta.remove();
            }, 3000);
        }
    }

    agregarGastoListado(gastos) {
        this.limpiarHTML();
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            const nuevoGasto = document.createElement("li");
            nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center";
            nuevoGasto.dataset.id = id;

            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`;

            const btnBorrar = document.createElement('button');
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
            btnBorrar.innerHTML = "&times;";

            nuevoGasto.appendChild(btnBorrar);

            gastoListado.appendChild(nuevoGasto);
        });
    }

    actualizarRestante(restante) {
        document.querySelector("#restante").textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector(".restante");

        // 75%
        if((presupuesto / 4) > restante ) {
            restanteDiv.classList.remove("alert-success", "alert-warning");
            restanteDiv.classList.add("alert-danger");
        } else if((presupuesto / 2) > restante) {
            restanteDiv.classList.remove("alert-success", "alert-danger");
            restanteDiv.classList.add("alert-warning");
        } else {
            restanteDiv.classList.remove("alert-danger", "alert-warning");
            restanteDiv.classList.add("alert-success");
        }

        if(restante <= 0) {
            userInterface.imprimirAlerta("El presupuesto se ha agotado.", "error");
            formulario.querySelector("button[type='submit']").disabled = true;
        }
    }

    limpiarHTML() {
        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
}

// Instancias
let presupuesto;
const userInterface = new UI();

// Funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = Number(prompt("¿Cuál es tú presupuesto?"));
    if(isNaN(presupuestoUsuario) || presupuestoUsuario === null || presupuestoUsuario <= 0) {
        window.location.reload();
    }
    presupuesto = new Presupuesto(presupuestoUsuario);
    userInterface.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
    e.preventDefault();

    const nombre = document.querySelector("#gasto").value;
    const cantidad = Number(document.querySelector("#cantidad").value);

    if(nombre.trim() === "") {
        userInterface.imprimirAlerta("Ambos campos son obligatorios.", "error");
        return;
    } else if(cantidad <= 0 || isNaN(cantidad)) {
        userInterface.imprimirAlerta("La cantidad no es válida.", "error");
        return;
    }

    const gasto = { nombre, cantidad, id: Date.now() };
    presupuesto.nuevoGasto(gasto);
    
    userInterface.imprimirAlerta("Gasto añadido correctamente.");

    const { gastos, restante } = presupuesto;
    userInterface.agregarGastoListado(gastos);

    userInterface.actualizarRestante(restante);
    userInterface.comprobarPresupuesto(presupuesto);

    formulario.reset();
}

function eliminarGasto(id) {
    presupuesto.eliminarGasto(id);
    const { gastos, restante } = presupuesto;
    userInterface.agregarGastoListado(gastos);
    userInterface.actualizarRestante(restante);
    userInterface.comprobarPresupuesto(presupuesto);
}
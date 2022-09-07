// Constructores
function Seguro (marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

// Realiza la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function () {

    let cantidad;
    const base = 2000;

    // Lee la diferencia de a;o entre el actual y el seleccionado
    const diferencia = new Date().getFullYear() - parseInt(this.year);

    switch(this.marca){
        // Los cases calculan el descuento del 3% dependiendo de la diferencia de a;o
        case '1':
            cantidad = (base * 1.15) * (1 - (diferencia * 0.03))
            break;
        case '2':
            cantidad = (base * 1.05) * (1 - (diferencia * 0.03));
            break;
        case '3':
            cantidad = (base * 1.35) * (1 - (diferencia * 0.03));
            break;
        default:
            break;
    }

    // Le a;ade un valor extra a la cantidad dependiendo del tipo de seguro
    
    if( this.tipo === 'basico') {
        cantidad *= 1.3;
    } else {
        cantidad *= 1.5;
    }

    return cantidad.toFixed(2);


}

function UI() {

}

// Llena las opciones de los a;os
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
          min = max - 20;

    const selectYear = document.querySelector('#year');

    for(let i = max; i > min; i--){
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild( option );
    }
}

// Muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement('div');

    if(tipo === 'error'){
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    // Insertar en el HTML
    const formulario = document.querySelector('#cotizar-seguro');

    if( ( document.getElementsByClassName('error').length) < 1 ){
        formulario.insertBefore(div, document.querySelector('#resultado'));
        setTimeout(() => {
            div.remove();
        }, 3000);
    }
}

UI.prototype.mostrarResultado = (seguro, total) => {
    
    const { marca, year, tipo } = seguro;
    let textoMarca;

    switch(marca){
        case '1':
            textoMarca = 'Americano';
        case '2':
            textoMarca = 'Asiatico';
        case '3':
            textoMarca = 'Europeo';
        default:
            break;
    }
    // Crear el resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');


    div.innerHTML = `
    <p class="header">Tu Resumen</p>
    <p class="font-bold">Marca: ${textoMarca}</p>
    <p class="font-bold">Año: ${year}</p>
    <p class="font-bold capitalize">Tipo: ${tipo}</p>
    <p class="font-bold">Total: $${total}</p>
    `;

    const resultadoDiv = document.querySelector('#resultado');

    // Mostrar spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    spinner.style.display = 'none'; // Se borra el spinner
    resultadoDiv.appendChild( div ); // Se muestra el texto
}

// Instanciar UI
const ui = new UI();
console.log( ui );

document.addEventListener( 'DOMContentLoaded', () => {
    ui.llenarOpciones(); // Llena el select con los a;os
});

EventListeners();

function EventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);

}

function cotizarSeguro( e ){
    e.preventDefault();

    // Leer la marca seleccionada
    const marca = document.querySelector('#marca').value;

    // Leer el a;o seleccionado
    const year = document.querySelector('#year').value;

    // Leer el tipo de cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if( marca === '' || year === '' || tipo === '' ){
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }
    // ui.mostrarMensaje('Cotizando...', 'correcto');

    // Ocultar las cotizaciones previas

    const resultados = document.querySelector('#resultado div');
    if(resultados !== null) {
        while( document.querySelector('#resultado').firstChild ){
            document.querySelector('#resultado').removeChild( document.querySelector('#resultado').firstChild );
        }
        resultados.remove();
    }

    // Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    // Utilizar el prototype que va a cotizar.
    ui.mostrarResultado(seguro, total);
}
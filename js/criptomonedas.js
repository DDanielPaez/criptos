// Selectores
const moneda = document.querySelector('#moneda');
const selectCripto = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

// guardar datos
const objBusqueda = {
    moneda: '',
    criptomoneda:'',
}

// Eventos
document.addEventListener('DOMContentLoaded',()=>{
    consultarCripto();

    moneda.addEventListener('input', obtenerValores);
    selectCripto.addEventListener('change', obtenerValores)
    formulario.addEventListener('submit', cotizar);

})

const obtenerCripto = criptomoneda => new Promise(resolve=>{
    resolve(criptomoneda);
})

function consultarCripto() {
    // url toplist del market cap API
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`

    fetch(url)
    .then(respuesta=>respuesta.json())  //consulta fue extiosa
    .then(resultado=>obtenerCripto(resultado.Data))
    .then(criptomonedas=>selectCriptomonedas(criptomonedas))
    .catch(error=>console.error())

}

function obtenerValores(e) {
    // console.log objBusqueda);
    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda);
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const {Name, FullName} = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        // Insertar en html
        selectCripto.appendChild(option);

    });
}

function cotizar(e) {
    e.preventDefault()

    // consultar valores guardados en el objetp
    const {moneda, criptomoneda} = objBusqueda;

    if (moneda === '' || criptomoneda === ''){
        // Validar que los campos no sean vacios
        // console.log('campos vacios');
        mostrarError('Los campos son obligatorios')
    }

    consultarAPI();
}

function mostrarError(mensaje){
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('error');

    // Mostrar el mensaje error
    divMensaje.textContent = mensaje;

    // Insertar en el HTML
    formulario.appendChild(divMensaje)

    // Bloque de error va a desaparecer luego de 5 sg
    setTimeout(()=>{
        divMensaje.remove();
    },5000)
}

function consultarAPI() {
    const {moneda, criptomoneda} = objBusqueda;
    // url multiple symbol full data
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    mostrarSpinner();

    fetch(url)
        .then(respuesta=>respuesta.json())
        .then(cotizar=>{
            mostrarResultado(cotizar.DISPLAY[criptomoneda][moneda]);
        })

}

function mostrarResultado(cotizacion) {
    limpiarHTML();

    const {CHANGEPCT24HOUR, PRICE, HIGHDAY, LOWDAY, LASTUPDATE} = cotizacion;

    const ult24horas = document.createElement('p');
    ult24horas.innerHTML = `<p>Variacion ultimas 24 horas: ${CHANGEPCT24HOUR}`

    const precio = document.createElement('p');
    precio.innerHTML= `El precio es: ${PRICE}`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML= `El precio mas alto del dia: ${HIGHDAY}`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML= `El precio mas bajo del dia: ${LOWDAY}`;

    const ultimaAct = document.createElement('p');
    ultimaAct.innerHTML= `Ultima actualizacion: ${LASTUPDATE}`;

    resultado.appendChild(ult24horas)
    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)
    resultado.appendChild(ultimaAct)

    formulario.appendChild(resultado)
}

function limpiarHTML() {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }    
}

function mostrarSpinner(){
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class =bounce1"></div>
        <div class =bounce2"></div>
        <div class =bounce3"></div>

    `
    // mostramos el spinner en el html
    resultado.appendChild(spinner)
}
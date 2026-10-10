// CONSTANTES Y VARIABLES
let jugNombre = "Jugador";
let intentosRealizados = 0;
let paresEncontrados = 0;

// Las rutas de las imágenes de los Pokémon (6 cartas base)
const imagenesCartas = [
    'img/bulbasur.webp',
    'img/charmander.webp',
    'img/pikachu.webp',
    'img/mimikyu.webp',
    'img/riolu.webp',
    'img/squirtle.webp'
];

// Variable que contiene el dorso de la carta
const dorsoCarta = 'img/dorsocartas.png';

let mazoRutas = [];  // Guarda las 12 cartas mezcladas
let primerIndiceSeleccionado = -1; // La primera carta que se cliquea
let bloqueado = false; // Se habilita la selección de cartas


// Al hacer clic en el botón para iniciar el juego se toma el nombre escrito
document.querySelector('#btn-iniciar-cartas').addEventListener('click', function () {
    jugNombre = document.querySelector('#jugador1-cartas').value || jugNombre;

    // Las cartas no son visibles
    document.querySelector('#setup-cartas').style.display = 'none';
    document.querySelector('#tablero-cartas').style.display = 'block';

    iniciarTableroCartas();
});

function iniciarTableroCartas() {
    mazoRutas = [];

    // Se duplican las imágenes con un for para formar los 6 pares
    for (let i = 0; i < imagenesCartas.length; i++) {
        mazoRutas.push(imagenesCartas[i]);
        mazoRutas.push(imagenesCartas[i]);
    }

    //REVISAR------------------------------------------------------------------------------
    for (let i = mazoRutas.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
            let temporal = mazoRutas[i]; // Guarda temporalmente el valor de la carta que está en la posición i para no perderlo
            mazoRutas[i] = mazoRutas[j]; // Copia el valor de la carta j en la posición i
            mazoRutas[j] = temporal; // Pone el valor guardado originalmente en i dentro de la posición j.
    }

    // Se inyecta la grilla que contiene las cartas al HTML
    let grilla = document.querySelector('#grilla-cartas');
    grilla.innerHTML = '';

    // Creamos las imágenes en el HTML usando un for
    for (let i = 0; i < mazoRutas.length; i++) {
        let imgElem = document.createElement('img'); // Crea la variable "imgElem" que contiene las imagenes de las cartas
        imgElem.src = dorsoCarta; // Empiezan boca abajo
        imgElem.id = "carta-" + i; // Le ponemos un ID numérico

        imgElem.addEventListener('click', function () {
            voltearCarta(i);
        });

        grilla.appendChild(imgElem);
    }

    // Los valores de la partida
    paresEncontrados = 0;
    intentosRealizados = 0;
    primerIndiceSeleccionado = -1;
    bloqueado = false;
    actualizarInfoCartas();
}
 //--------------------------------------------------------------------------------------REVISAR.

 
function voltearCarta(indice) {
    // Si está bloqueado, no hacemos nada
    if (bloqueado) {
        return;
    }

    let cartaActual = document.querySelector("#carta-" + indice);

    // Si la carta ya está oculta o ya está dada vuelta, no hace nada :""""V
    if (cartaActual.style.visibility === 'hidden' || primerIndiceSeleccionado === indice) {
        return;
    }

    // Se da vuelta la carta mostrando su imagen
    cartaActual.src = mazoRutas[indice];

    /* -1= EL JUGADOR NO TOCO NADA :V, */
    if (primerIndiceSeleccionado === -1) {
        primerIndiceSeleccionado = indice;
    }

    /* Si ya tocaste la primera carta, se identifica la segunda que se gira y como primera acción se
    aumentan los intentos realizados*/

    else {
        intentosRealizados++;
        actualizarInfoCartas();

        bloqueado = true; // Para que no se pueda seguir interactuando o muere la página (no borren el bloqueo >:V)

        let cartaAnterior = document.getElementById("carta-" + primerIndiceSeleccionado);


        // COMPRUEBA SI LAS RUTAS DE LAS IMÁGENES SON IGUALES-------REVISAR----------------------------
        if (mazoRutas[primerIndiceSeleccionado] === mazoRutas[indice]) {

            /*mazoRutas guarda las direcciones de todas las imágenes.
            primerIndiceSeleccionado es la posición de la primera carta que el jugador dio vuelta.
            indice es la posición de la segunda carta que acaba de tocar.*/
        
            // Oculta las dos cartas
            setTimeout(function () {
                cartaAnterior.style.visibility = 'hidden';
                cartaActual.style.visibility = 'hidden';

                paresEncontrados++;
                primerIndiceSeleccionado = -1;
                bloqueado = false;

                actualizarInfoCartas();

                // Si llega a 6 pares, gana
                if (paresEncontrados === 6) {
                    finalizarJuegoCartas();
                }
            }, 500); /*Durante medio segundo (500ms) no se puede interactuar con las cartas hasta que
                    que no desaparezcan, antes de que suceda el medio segundo se actualizan los valores
                    del jugador en la partida (pares encontrados)*/
        }

        else {
            // Al escoger el par incorrecto se vuelven a dar vuelta las cartas
            setTimeout(function () {
                cartaAnterior.src = dorsoCarta;
                cartaActual.src = dorsoCarta;

                primerIndiceSeleccionado = -1;
                bloqueado = false;
            }, 1000);
        }
    } 
}

//estaría bueno poner un boton para reiniiciar la partida/listo jeje
document.querySelector('#btn-reiniciar-cartas').addEventListener('click', function () {
    iniciarTableroCartas();
});

function actualizarInfoCartas() {
    document.querySelector('#turno-cartas').innerText = "Jugador: " + jugNombre;
    document.querySelector('#puntajes-cartas').innerText = "Pares: " + paresEncontrados + " / 6 | Intentos: " + intentosRealizados;
} // Se muestran los valores del jugador durante la partida

function finalizarJuegoCartas() {
    alert("¡Felicitaciones " + jugNombre + "! Ganaste el juego en " + intentosRealizados + " intentos.");

    let puntuaciones = JSON.parse(localStorage.getItem('puntuaciones')) || { dados: [], cartas: [], preguntas: [] };
    puntuaciones.cartas.push({ jugador: jugNombre, intentos: intentosRealizados });
    localStorage.setItem('puntuaciones', JSON.stringify(puntuaciones));
} // copien esto en todas las paginas y modifiquenlo para subirlo a puntuaciones
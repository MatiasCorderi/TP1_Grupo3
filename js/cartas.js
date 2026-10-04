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

const dorsoCarta = 'img/dorsoCartas.png';

let mazoRutas = [];  // Guarda las 12 cartas mezcladas
let primerIndiceSeleccionado = -1; //la primera carta que se cliquea
let bloqueado = false;

/*-------------------------------------------------------------------------------*/


document.getElementById('btn-iniciar-cartas').addEventListener('click', function () {
    jugNombre = document.getElementById('jugador1-cartas').value || "Jugador";

    document.getElementById('setup-cartas').style.display = 'none';
    document.getElementById('tablero-cartas').style.display = 'block';

    iniciarTableroCartas();
});

function iniciarTableroCartas() {
    mazoRutas = [];

    // Duplicamos las imágenes usando un FOR clásico para formar los 6 pares (12 cartas)
    for (let i = 0; i < imagenesCartas.length; i++) {
        mazoRutas.push(imagenesCartas[i]);
        mazoRutas.push(imagenesCartas[i]);
    }

    //REVISAR------------------------------------------------------------------------------
    for (let i = mazoRutas.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temporal = mazoRutas[i];//Guarda temporalmente el valor de la carta que está en la posición i para no perderlo
        mazoRutas[i] = mazoRutas[j];//Copia el valor de la carta j en la posición i
        mazoRutas[j] = temporal;//Pone el valor guardado originalmente en i dentro de la posición j.
    }

    /* NOTA:
     Esto me estaba costando y lo consulte directamente a la IA, tiro de usar el método "Fisher-Yates" por si lo quieren buscar.
     Para resumirlo básicamente toma la última carta de la lista, elige otra carta al azar entre las 
     restantes y las cambia de lugar (usando la variable 'temporal' para no perder datos). 
     Despues repite el mismo paso con la penúltima carta, y así hacia atrás hasta llegar al inicio del mazo.
    */

    // Se inyecta la grilla que contiene las cartas al HTML
    let grilla = document.getElementById('grilla-cartas');
    grilla.innerHTML = '';

    // Creamos las imágenes en el HTML usando un FOR en lugar de forEach
    for (let i = 0; i < mazoRutas.length; i++) {
        let imgElem = document.createElement('img');
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

    let cartaActual = document.getElementById("carta-" + indice);

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

function actualizarInfoCartas() {
    document.getElementById('turno-cartas').textContent = "Jugador: " + jugNombre;
    document.getElementById('puntajes-cartas').textContent = "Pares: " + paresEncontrados + " / 6 | Intentos: " + intentosRealizados;
} // Se muestran los valores del jugador durante la partida

function finalizarJuegoCartas() {
    alert("¡Felicitaciones " + jugNombre + "! Ganaste el juego en " + intentosRealizados + " intentos.");

    let puntuaciones = JSON.parse(localStorage.getItem('puntuaciones')) || { dados: [], cartas: [], preguntas: [] };
    puntuaciones.cartas.push({ jugador: jugNombre, intentos: intentosRealizados });
    localStorage.setItem('puntuaciones', JSON.stringify(puntuaciones));
} // Se muestra que el jugador ganó la partida
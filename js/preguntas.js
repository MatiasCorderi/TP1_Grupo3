let aciertos = 0;
let tiempo = 60;
let intervalo;
let pokemonActual = null;
let nombreJugador = "";
let respondido = false;
let juegoActivo = false;

// Si se hace clic en el botón para empezar la partida se guarda el nombre escrito por el jugador
document.querySelector('#btn-iniciar-trivia').addEventListener('click', function () {
    let inputNombre = document.querySelector('#nombre-jugador-trivia').value;

    // Si dejaron el nombre vacío, se usa uno por defecto
    if (inputNombre === "") {
        nombreJugador = "Jugador";
    } else {
        nombreJugador = inputNombre; // Sino se usa el nombre ingresado por el jug :V
    }

    // Se oculta el menú para ingresar nombre y se deja ver la trivia
    document.querySelector('#setup-preguntas').style.display = 'none';
    document.querySelector('#tablero-preguntas').style.display = 'block';

    juegoActivo = true; // Se habilita el juego

    intervalo = setInterval(function () {
        tiempo--; // Cada 1000ms se le resta 1 segundo al contador
        document.querySelector('#tiempo-trivia').innerText = tiempo;

        if (tiempo <= 0) { // Si el tiempo llega a 0 o menos se acaba el juego
            finalizarTrivia();
        }
    }, 1000); // 1 segundo

    siguientePregunta(); // Se muestra la primera pregunta
});

async function siguientePregunta() {

    respondido = false; // Se establece que el jugador no ha contestado ninguna opción

    try {
        // Se busca un Pokemon correcto al azar
        let idCorrecto = Math.floor(Math.random() * 151) + 1; // Agarra un pokémon al azar
        let res = await fetch("https://pokeapi.co/api/v2/pokemon/" + idCorrecto); // Espera la opción correcta
        let data = await res.json(); // Se convierten las respuestas correctas en un .json
        pokemonActual = data.name;

        document.querySelector('#img-pokemon').src = data.sprites.front_default; // Se cargan los sprites
        document.querySelector('#img-pokemon').classList.add('silueta'); // Se ponen en negro

        // Se buscan 3 opciones incorrectas
        let opciones = [pokemonActual];
        for (let i = 0; i < 3; i++) {
            let idFalso = Math.floor(Math.random() * 151) + 1; // Agarra 3 pokemones al azar
            let resFalso = await fetch("https://pokeapi.co/api/v2/pokemon/" + idFalso); // Espera las opciones incorrectas
            let dataFalso = await resFalso.json(); // Se convierten las respuestas incorrectas en un .json
            opciones.push(dataFalso.name);
        }

        // Se mezclan las 4 opciones (lo mismo que en el de las cartas :v) xd lol
        for (let i = opciones.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temporal = opciones[i];
            opciones[i] = opciones[j];
            opciones[j] = temporal;
        }

        let contOpciones = document.querySelector('#opciones-trivia');
        contOpciones.innerHTML = ''; // Elige donde apareceran los botones en el HTML
        // y le agrega las opciones

        // Creamos los botones con un for y le agrega los pokemones
        for (let i = 0; i < opciones.length; i++) {
            let btn = document.createElement('button');
            btn.classList.add('boton');
            btn.innerText = opciones[i];

            // Le asignamos su evento de clic
            btn.addEventListener('click', function () {
                verificarRespuestaTrivia(opciones[i]); // Al hacer clic se verifica si
                // la respuesta es correcta
            });

            contOpciones.append(btn); // Inyecta los botones en el HTML y se pueden visualizar
        }

    } catch (error) {
        document.querySelector('#cargando-pokemon').innerHTML = 'No se pudo cargar la pregunta. Reintentando...:V';
        setTimeout(siguientePregunta, 1000);
    }
}

function verificarRespuestaTrivia(respuesta) {
   
    if (respondido) {
        return;
    } 
    
    respondido = true;
    
    document.querySelector('#img-pokemon').classList.remove('silueta'); // Se revela el pokémon

    if (respuesta === pokemonActual) { // Si la respuesta es ESTRICAMENTE igual al pokémon actual
        // se aumenta y actualiza la cantidad de aciertos
        aciertos++;
        document.querySelector('#aciertos-trivia').innerText = aciertos;
    }

    // Se espera 1 segundo y pasa al siguiente pokémon
    setTimeout(siguientePregunta, 1000);
}

function finalizarTrivia() {
    alert("Conseguiste " + aciertos + " aciertos.");

    let puntuaciones;
    
    try {
        puntuaciones = JSON.parse(localStorage.getItem('puntuaciones'));
        // Busca en la memoria del navegador los textos guardados en "puntuaciones"
        // para guardarlos en un JSON para que puedan mostrarse
    } catch (error) {
        puntuaciones = null; // Si el catch agarra un error, puntuaciones se vuelve null y se crea la estructura desde cero
    }

    // Si no hay nada guardado todavía se resetea la tabla de puntos
    if (puntuaciones === null) {
        puntuaciones = { dados: [], cartas: [], preguntas: [] };
    }

    puntuaciones.preguntas.push({ nombre: nombreJugador, aciertos: aciertos });
    localStorage.setItem('puntuaciones', JSON.stringify(puntuaciones));

    reiniciarTrivia();
}

function reiniciarTrivia() {
    juegoActivo = false; // Corta los setTimeout pendientes

    // Reset de los valores
    aciertos = 0;
    tiempo = 60;
    respondido = false; // Esto hace que no puedas seguir tocando pokemones luego de la alerta final

    // Se resetean los valores de lo que se ve
    document.querySelector('#tiempo-trivia').innerText = tiempo;
    document.querySelector('#aciertos-trivia').innerText = aciertos;

    // Vuelve a la pantalla del inicio
    document.querySelector('#tablero-preguntas').style.display = 'none';
    document.querySelector('#setup-preguntas').style.display = 'block';
}
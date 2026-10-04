let jugadores = [];
let turnoActual = 0;

// Mostrar los inputs correspondientes cuando tocan "Siguiente" 
document.getElementById('btn-generar-inputs').addEventListener('click', function() {
    let cantidad = parseInt(document.getElementById('cant-jugadores').value);
    let container = document.getElementById('inputs-nombres');
    
    // Mostramos el contenedor general
    container.style.display = 'block';
    
    // Primero ocultamos los 4 inputs (por si el usuario se arrepiente y cambia de 4 a 2)
    for (let i = 0; i < 4; i++) {
        document.getElementById("nombre-dado-" + i).style.display = 'none';
    }
    
    // Se muestra solo la cantidad que eligió el usuario
    for (let i = 0; i < cantidad; i++) {
        document.getElementById("nombre-dado-" + i).style.display = 'inline-block';
    }
});

// Se inicia el juego usando los inputs que ya están en el HTML
document.getElementById('btn-iniciar-dados').addEventListener('click', function() {
    let cantidad = parseInt(document.getElementById('cant-jugadores').value);
    jugadores = [];
    
    for (let i = 0; i < cantidad; i++) { // Se buscan lo id de los nombres desde el número 0
        let inputNombre = document.getElementById("nombre-dado-" + i);
        let nom = inputNombre.value;
        
        if (nom === "") {
            nom = "Jugador " + (i + 1); // Si el campo está vacío registra el Jugador 1, 2, 3, 4 por default
                                           // empezando desde 0
        }
        
        // Cada jugador empieza con 0 puntos
        jugadores.push({ nombre: nom, puntaje: 0 });
    } 
    
    iniciarJuegoDados();
});

function iniciarJuegoDados() {
    // Se deja de mostrar la configuración de la partida y se muestra el tablero
    document.getElementById('setup-dados').style.display = 'none';
    document.getElementById('tablero-dados').style.display = 'block';
    
    actualizarInterfaz(); // Muestra los nombres, puntaje y turno antes del primer clic
}

document.getElementById('btn-lanzar').addEventListener('click', function() {
    
    /* Al hacer clic en el boton te da por dado un numero del 0 al 1 (Mathrandom), lo multiplica por la cara de los
    dados (6) y lo suma en +1. Si por ej da 6.7 mathfloor lo redondea para abajo (6). Como no nos puede dar
    como resultado un 0 en ningún dado, al mathrandom se le suma uno para que si este da por ej 0.4 se suma a 1.4
    y se redondea para abajo (1)*/

    let d1 = Math.floor(Math.random() * 6) + 1;
    let d2 = Math.floor(Math.random() * 6) + 1;
    let caras = ['🎲', '⚀','⚁','⚂','⚃','⚄','⚅'];
    /* Posiciones de dados: el dado a color que es la posición 0 sirve como un valor de relleno. Como en d1 y d2
    nunca saldrá 0, no sale ese dado. Como los valores dan entre 1 y 6, las caras que saldrán en cada tirada son
    las de las posiciones 1 a 6 en el array caras */

    document.getElementById('dado1').textContent = caras[d1];
    document.getElementById('dado2').textContent = caras[d2];
    
    let suma = d1 + d2; // Suma los dado que salieron en la tirada
    let msj = document.getElementById('mensaje-dados');
    
    // Reglas del juego
    if (suma === 7) { // Si la suma da ESTRICTAMENTE el número 7 no se suman puntos y termina el turno
        msj.textContent = "¡Sacaste 7! No sumás puntos en esta ronda.";
    } else {
        jugadores[turnoActual].puntaje = jugadores[turnoActual].puntaje + suma;
        msj.textContent = "¡Sumaste " + suma + " puntos!";
        /* Si no salió 7, llama al nombre del jugador, su turno y puntaje, para posteriorme sumar los resultados
        del turno*/
    }
    
    // Se comprueba si el jugador actual ganó
    if (jugadores[turnoActual].puntaje >= 100) {
        msj.textContent = "¡🏆 " + jugadores[turnoActual].nombre + " GANA EL JUEGO con " + jugadores[turnoActual].puntaje + " puntos!";
        /* Si el puntaje de alguno de los jugadores es 100 o mayor, llama al nombre del jugador y su puntaje para
        mostrar quien ganó */

        guardarPuntuacion('dados', jugadores, jugadores[turnoActual]); // Se guardan los datos de todos los jugadores
        actualizarInterfaz(); // Se actualizan los datos de la partida

        // Se bloquea el botón para que no se pueda seguir tirando los dados
        document.getElementById('btn-lanzar').disabled = true;
    } else {
        // Si nadie ganó se suma el turno actual para pasar al siguiente jugador
        turnoActual++;
        
        // Si ya tiró el último jugador, se vuelve al turno 0 (jugador 1)
        if (turnoActual === jugadores.length) { // jugadores.length sería el máximo de jugadores en la partida, si se
            // llega a ese valor (turno 1) se reestablece la ronda
            turnoActual = 0;
        }
        
        actualizarInterfaz(); // Se actualizan los datos del turno
    }
});

function actualizarInterfaz() {
    document.getElementById('turno-actual').textContent = "Turno de: " + jugadores[turnoActual].nombre;
    // Se muestra de quién es el turno
    
    let contenedorPuntajes = document.getElementById('puntuaciones-actuales');
    contenedorPuntajes.innerHTML = ''; // Tras cada clic se borran los puntos de la ronda anterior
    // para mostrar los nuevos
    
    let titulo = document.createElement('h4');
    titulo.textContent = "Puntajes:";
    contenedorPuntajes.appendChild(titulo); // Se muestra el titulo puntajes como un h4
    
    let lista = document.createElement('ul'); // Se muestra la lista de jugadores y sus puntajes como un ul
    
    // Se arma la lista de jugadores con un for
    for (let i = 0; i < jugadores.length; i++) {
        let itemLista = document.createElement('li'); // Se crean elementos de lista según la cantidad de jugadores
        itemLista.textContent = jugadores[i].nombre + ": " + jugadores[i].puntaje + " pts"; // Se agrega el nombre
        // y puntaje de cada jugador en las listas

        lista.appendChild(itemLista); // Se introducen los elementos de itemLista a lista
    }
    
    contenedorPuntajes.appendChild(lista); // Se introduce la lista de los jugadores en el contenedor de puntajes
}

function guardarPuntuacion(juego, todosJugadores, ganador) {
    let puntuaciones = JSON.parse(localStorage.getItem('puntuaciones'));
    /* Va a la memoria del navegador y busca lo que esté guardado bajo la clave 'puntuaciones'. Se traduce ese
    texto guardado a un objeto de JavaScript real.*/ 
    
    // Si no hay nada guardado todavía, se crea la estructura desde cero.

    // Si es la primera vez que se juega en esa computadora, el navegador no va a encontrar nada (null).
    // Si da null, el if crea la estructura desde cero: un objeto con tres listas vacías

    if (puntuaciones === null) {
        puntuaciones = { dados: [], cartas: [], preguntas: [] };
    }
    
    puntuaciones.dados.push({ jugadores: todosJugadores, ganador: ganador.nombre });
    // Se va a la lista de partidas de dados (puntuaciones.dados) y le agrega (.push()) un nuevo objeto con dos
    // datos: la lista de todos los participantes y el nombre de quien ganó.


    localStorage.setItem('puntuaciones', JSON.stringify(puntuaciones));
    // Se toma el objeto de JavaScript con la nueva partida agregada y lo guarda en formato de texto.
    // Luego se sobrescribe y guarda ese texto actualizado en el navegador.
}
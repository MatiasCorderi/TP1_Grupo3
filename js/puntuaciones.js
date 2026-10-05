//esto lo recomendo la IA, el listener esta esperando a que el dom se cargue por completo para 
document.addEventListener("DOMContentLoaded", function() {
    let puntuaciones = JSON.parse(localStorage.getItem('puntuaciones'));
    if (puntuaciones === null) {
        puntuaciones = { dados: [], cartas: [], preguntas: [] };
    }


    // Se buscan las etiquetas <article>
    let articulos = document.querySelectorAll('article');

    // Se cargan los datos del juego de cartas (primer article posición 0)
    let juegoCartas = articulos[0];

    puntuaciones.cartas.sort(function(a, b) { // El sort tambien lo recomendó, ordena los elementos y te los devuelve en un array :D
        return b.intentos - a.intentos; // Se ordena por cantidad de intentos de mayor a menor
        });

    for (let i = 0; i < puntuaciones.cartas.length; i++) {
        let p = puntuaciones.cartas[i];
        
        juegoCartas.innerHTML += "<p>Jugador: " + p.jugador + "<br>Intentos: " + p.intentos + "</p>";
    }

    // Se cargan los datos del juego de dados (segundo article posición 1)
    let juegoDados = articulos[1];
    for (let i = 0; i < puntuaciones.dados.length; i++) {
        let p = puntuaciones.dados[i];
        
        // el texto de los jugadores separados por " | " jeje
        let jugadoresNombres = "";
        for (let j = 0; j < p.jugadores.length; j++) {
            jugadoresNombres = jugadoresNombres + p.jugadores[j].nombre + " (" + p.jugadores[j].puntaje + ")";
            if (j < p.jugadores.length) jugadoresNombres = jugadoresNombres + "<br>";
        }
        
        juegoDados.innerHTML += "<p>Jugadores: <br>" + jugadoresNombres + "<br>Ganador: 🏆 " + p.ganador + "</p>";
    }


    // Se cargaN los datos del juego de pregunta (tercer article posicion 2)
    let preguntasJuego = articulos[2];
    
    // Ordena de mayor a menor los aciertos
    puntuaciones.preguntas.sort(function(a, b) {
        return b.aciertos - a.aciertos;
    });


    for (let i = 0; i < puntuaciones.preguntas.length; i++) {
        let p = puntuaciones.preguntas[i];
        
        //Nombre y Aciertos
        preguntasJuego.innerHTML += "<p>Jugador: " + p.nombre +  "<br>Aciertos: " + p.aciertos + "</p>";
    }
});
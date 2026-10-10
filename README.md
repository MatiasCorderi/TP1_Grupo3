TP1-IG-Grupo3

Nombre del proyecto: Poké Juegos
Integrantes del grupo: Valentín Manzur, Azul Girard Kohakura y Matías Djibilian Corderí
Datos de materia: Informática General - Artes Multimediales - UNA

Descripción general del sitio: página web de minijuegos con temática Pokémon. Tiene tres juegos, una página de puntuaciones que guarda los resultados en el navegador y una página de desarrollo con los integrantes.

Descripción y reglas de cada juego:
- Poke-test (memotest): encontrar los 6 pares de Pokémon dando vuelta 2 cartas por turno, en la menor cantidad de intentos posible.
- Poke-Dados: 2 a 4 jugadores por turnos; cada jugador tira 2 dados y los suma a su puntaje, pero si la suma da 7 no suma nada. Gana el primero en llegar a 100 puntos.
- ¿Quién es ese Pokémon? (trivia): 60 segundos para adivinar, entre 4 opciones, el Pokémon que aparece en silueta. Cada acierto suma un punto.

Organización de archivos y carpetas: un HTML por página (index, juegocartas, juegodados, juegopreguntas, puntuaciones, desarrollo); carpeta con la hoja de estilos css; un archivo js por juego (cartas.js, dados.js, preguntas.js, puntuaciones.js) y una capeta con todas las imágenes.

Tecnologías utilizadas: HTML 5, CSS 3 y JavaScript, PokeAPI y Google Fonts.

Descripción de las principales funcionalidades: navegación, elementos creados con JavaScript (cartas, botones y inputs), mezcla aleatoria con el algoritmo "Fisher–Yates"*, puntajes guardados en localStorage y temporizadores (setInterval/setTimeout).




Declaración de uso de IA:
- Herramientas: ChatGPT / Gemini

Para la realización de la página de Poke-Juegos nos apoyamos bastante en la Inteligencia Artificial a lo largo de todo el desarrollo de la página.

Al comienzo, le presentamos la idea puntual que teníamos pensada y le pedimos que nos ayudara a estructurar la parte de JavaScript, orientándonos sobre qué herramientas nos convenía más implementar y de qué manera podíamos organizar el proyecto.

A medida que íbamos avanzando con la programación, la fuimos consultando de forma recurrente para resolver errores de código y problemas de funcionamiento que nos iban surgiendo. En casos específicos, como en la implementación del algoritmo de Fisher-Yates, utilizamos un bloque de código tal cual nos lo sugirió la herramienta, y a partir de ahí nos dedicamos a investigar y analizar en detalle su funcionamiento para comprender bien qué estaba haciendo esa lógica.

Por último, para la integración de la API el uso de la IA fue fundamental, ya que nos facilitó mucho la comprensión de cómo solicitar, interpretar y manipular los datos dentro de la aplicación.


Desarrollo:

El desarrollo de PokéJuegos arrancó con un proceso largo para decidir qué juegos íbamos a armar. Una vez que nos pusimos de acuerdo, lo primero que hicimos fue crear una base bastante básica y carente de estilos para ir probando. Elegimos como punto de partida la PokeAPI y, a partir de ahí, fuimos desarrollando cada uno de los minijuegos.

El primero en la lista fue el juego de cartas (memotest), que nos costó bastante trabajo. Nos quedamos muy trabados con la lógica de la interactividad, pero con la ayuda de la Inteligencia Artificial pudimos destrabarlo y llevarlo a cabo tal cual lo teníamos planeado desde el principio.

El segundo fue el juego de los dados. La idea principal era mantener esa misma dinámica pero sumando más reglas, jugando directamente contra un Pokémon y haciendo que los dados sean imágenes. Sin embargo, debido a complicaciones con la complejidad técnica y la falta de tiempo, terminamos descartando esa versión inicial y simplificándolo bastante.

Por otro lado, el juego basado en la API era el que más teníamos planificado, pero el que menos sabíamos cómo hacer en código. Para encararlo, nos apoyamos bastante en la IA para entender cómo funcionaba la API por dentro y resolver la dinámica del timer, además de aplicar los estilos para que las imágenes se vuelvan completamente negras y queden como siluetas.

Por último, tuvimos bastantes problemas con el sistema de puntuaciones al momento de inyectar los datos en el HTML. Con el fin de establecer un registro de récords, decidimos aplicar el método sort para organizar los puntos: de mayor a menor para el juego de preguntas y respuestas, y de menor a mayor para contabilizar los intentos en el memotest.
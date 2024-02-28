import data from './data/preguntas.json' assert { type: 'json' };

// Variables
// -----------------------------------------------------------------------------

var numPlayers = 9 
let words = []
var players = []
let turno = 0

// Modificacion
let jugador1 = 0
let jugador2 = 0
let fallosPreguntaActual = 0

function $(elementId) {
    return document.getElementById(elementId);
}

function defaultWords() {
    loadWords(data);
    createCircle();
}

function createWords(loadedJson = null, startGame) {
    removeCircle();
    words = [];
    loadWords(loadedJson || data);
    createCircle();

    if (startGame) {
        showControls();
    }
}

function loadWords(jsonData) {
    for (const { questionId, letter, introduction, description, solutions } of jsonData.preguntas) {
        let palabra = new Word(questionId, letter, introduction, description, solutions);
        words.push(palabra);
    }
}

function showControls() {
    $("js--ng-controls").classList.add("hidden");
    $("js--question-controls").classList.remove("hidden");
    $("js--close").classList.remove("hidden");
    showDefinition(count);
    countdown();
}

// Functions
// -----------------------------------------------------------------------------
function Word(idNumber, letter, hint, definition, word, correct) {
	this.idNumber = idNumber;
	this.letter = letter;
	this.hint = hint;
	this.definition = definition;
	this.word = word;
	this.correct = null;
}

function chooseGroupsToPlay() {
    for (let index = 0; index < 2; index++) {
        let numPlayer = Math.floor(Math.random()*numPlayers + 1);
        while (players.includes(numPlayer)) {
            numPlayer = Math.floor(Math.random()*numPlayers + 1);
        }

        players.push(numPlayer);        
    }
    console.log("jugadores aleatorios: " + players);
}

window.players = players;

function createCircle() {
    const circle = $("circle");

    words.forEach(({ letter }) => {
        const li = document.createElement("li");
        li.className = "item";
        li.textContent = letter;

        circle.appendChild(li);
    });
}

function removeCircle() {
    const circle = $("circle");

    // Remove all childs form "circle" element
    while (circle.firstChild) {
        circle.removeChild(circle.firstChild);
    }
}

function showDefinition(pos) {
    $("js--hint").innerHTML = words[pos].hint;
    $("js--definition").innerHTML = words[pos].definition;
}

let correctWords = 0;

function checkAnswer(pos) {
    // showCurrentPlayer()
    const userAnswer = $("js--user-answer").value;

    const arrayPalabras = words[pos].word;
    // console.log(turno);
    
    if (arrayPalabras.includes(userAnswer.trim().toLowerCase())) {
        words[pos].correct = true;
        if (fallosPreguntaActual < 1) {
            document.querySelectorAll(".circle .item")[words[pos].idNumber].classList.remove("item--gray");
        }
        if (fallosPreguntaActual === 1) {
            document.querySelectorAll(".circle .item")[words[pos].idNumber].classList.add("item--orange");
        }

        document.querySelectorAll(".circle .item")[words[pos].idNumber].classList.add("item--success");
        correctWords++;
        fallosPreguntaActual = 0 // Cambio
        $("js--score").innerHTML = correctWords;

        addPointCurrentPlayer()
        return count++; // Cambio
    } else {
        // words[pos].correct = false;
        // document.querySelectorAll(".circle .item")[words[pos].idNumber].classList.add("item--failure");

        // Cambio
        changeTurn()
        fallosPreguntaActual += 1
        // showCurrentPlayer()
        // console.log(turno);

        document.querySelectorAll(".circle .item")[words[pos].idNumber].classList.add("item--gray");
        if (fallosPreguntaActual === 2) {
            words[pos].correct = false;
            document.querySelectorAll(".circle .item")[words[pos].idNumber].classList.remove("item--gray");
            document.querySelectorAll(".circle .item")[words[pos].idNumber].classList.add("item--failure");
            fallosPreguntaActual = 0
            return count++;
        }
        
    }

    // return count++; Cambio
}

function pasapalabra(pos) {
	const w = words.splice(pos, 1)[0];
	words.push(w);
}

function continuePlaying() {
    if (count !== 25) {
        $("js--user-answer").value = "";
        showDefinition(count);
    } else {
        endGame();
    }
}

function showCurrentPlayer() {
    const turnoDe = $("turnoDe");

    turnoDe.textContent = "Turno del Grupo " + players[turno];

    turnoDe.style = "color: white; text-decoration: underline;"

    // jugadores.appendChild(h4);
}

function addPointCurrentPlayer() {
    if (turno === 0) {
        jugador1 += 1
        
    } else if (turno === 1) {
        jugador2 += 1
    } 
}

function showPlayers() {
    const jugadores = $("jugadores");
    const h4 = document.createElement("h4");

    h4.textContent = "Grupo " + players[0] + " VS Grupo " + players[1];

    h4.style = "margin-bottom: 0px"

    jugadores.appendChild(h4);

    // players.forEach((number) => {
    //     console.log(number)
        
        
    //     p.textContent = "Grupo " + number;

    //     jugadores.appendChild(p);
    // });
}

function changeTurn() {
    turno = turno === 0 ? 1 : 0
}

let seconds;
let temp;
let timeoutMyOswego;

function countdown() {
    seconds = $('js--timer').innerHTML;
    seconds = parseInt(seconds, 10);
    
    if (seconds == 1) {
        temp = $('js--timer');
        temp.innerHTML = 0;
        endGame();
        return;
    }
    
    seconds--;
    temp = $('js--timer');
    temp.innerHTML = seconds;

    timeoutMyOswego = setTimeout(countdown, 1000);
}

function endGame() {
	clearTimeout(timeoutMyOswego); // Detiene el temporizador

	$('js--question-controls').classList.add('hidden');
	$('js--pa-controls').classList.remove('hidden');
	// $('js--end-title').innerHTML = 'Fin de partida!';
	$('js--end-title').innerHTML = 'Ha ganado el Grupo ' + players[turno];
	// $('js--end-subtitle').innerHTML = showUserScore();
	$('js--end-subtitle-1').innerHTML = showUserScore(0);
    $('js--end-subtitle-1').style = "margin-top: 40px; margin-bottom: 0px"
	$('js--end-subtitle-2').innerHTML = showUserScore(1);
	$('js--close').classList.add('hidden');
}

function showUserScore(playerId) {
	let counter = 0;
	if (playerId === 0) {
        counter = jugador1
    } else if (playerId === 1) {
        counter = jugador2
    }

	return "El Grupo " + players[playerId] + " Ha conseguido un total de " + counter + " acierto" + (counter == 1 ? '' : 's') + '.';
}

// function showUserScore() {
// 	let counter = 0;
// 	for (let i = 0; i < words.length; i++) {
// 		if (words[i].correct == true) {
// 			counter++;
// 		}
// 	}

// 	return "Has conseguido un total de " + counter + " acierto" + (counter == 1 ? '' : 's') + '.';
// }

// Main Program
// ----------------------------------------------------------------------------- */

// New game
let count = 0; // Counter for answered words

defaultWords();
chooseGroupsToPlay()
showCurrentPlayer()
// Prerender game
$("jsonFileInput").addEventListener("change", function() {
    loadJsonFile();
});

// Prepare game
$("js--new-game").addEventListener("click", function() {
    loadJsonFile(true);
});

// Send the answer
$("js--send").addEventListener("click", function() {
	checkAnswer(count);
    showCurrentPlayer()
	continuePlaying();
});  

// Key bindings for send the answer
$("js--question-controls").addEventListener("keypress", function(event) {
    let key = event.key;
    if (key === "Enter") {
        checkAnswer(count);
        showCurrentPlayer()
        continuePlaying();
    }
});

// Skip the word
$("js--pasapalabra").addEventListener("click", function() {
    pasapalabra(count);
    continuePlaying();
});

// Key bindings for skip the word
$("js--question-controls").addEventListener("keydown", function(event) {
    let key = event.key;
    if (key === " ") {
        pasapalabra(count);
        continuePlaying();
    }
});

// Play again
$("js--pa").addEventListener("click", function() {
    location.reload();
});

// End the game
$("js--close").addEventListener("click", function() {
    endGame();
});

function loadJsonFile(startGame = false) {
    const fileInput = $('jsonFileInput');
    const JsonInput = $('textoJSON');
    
    if (fileInput.files.length > 0) {
        players = window.players
        showPlayers()
        
        console.log("jugadores que van a jugar: " + players);
        
        const file = fileInput.files[0];

        const reader = new FileReader();

        reader.onload = function(e) {
            const content = e.target.result;
            JsonInput.innerText = file.name;

            try {
                const jsonData = JSON.parse(content);
                createWords(jsonData, startGame);
            } catch (error) {
                console.error('Error al analizar el archivo JSON:', error);
            }
        };

        reader.readAsText(file);
    } else {
        // If no file was selected, use the JSON you already had by default
        createWords(null, startGame);
        console.warn('Se está utilizando los datos por defecto, ya que no se ha seleccionado un archivo JSON.');
    }
}


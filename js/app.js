import data from './data/preguntas.json' assert { type: 'json' };

// Variables
// -----------------------------------------------------------------------------
let words = []

for(const { questionId, letter, introduction, description, solutions } of data.preguntas) {
	let palabra = new Word(questionId, letter, introduction, description, solutions)
	words.push(palabra)
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

function showDefinition(pos) {
	$("#js--hint").html(words[pos].hint);
	$("#js--definition").html(words[pos].definition);
}

let correctWords = 0;

function checkAnswer(pos) {	
	const userAnswer = $("#js--user-answer").val();
	
	const arrayPalabras = words[pos].word;
	if (arrayPalabras.includes(userAnswer.toLowerCase())) {
		words[pos].correct = true;
		$(".circle .item").eq(words[pos].idNumber).addClass("item--success");
		correctWords++;
		$("#js--score").html(correctWords);
	} else {
		words[pos].correct = false;
		$(".circle .item").eq(words[pos].idNumber).addClass("item--failure");
	}

	return count++;
}

function pasapalabra(pos) {
	const w = words.splice(pos, 1)[0];
	words.push(w);
}

function continuePlaying() {
	if (count != 25) {
		$("#js--user-answer").val("");
		showDefinition(count);
	} else {
		endGame();
	}
}

let seconds;
let temp;
let timeoutMyOswego;

function countdown() {
    seconds = document.getElementById('js--timer').innerHTML;
    seconds = parseInt(seconds, 10);
    
    if (seconds == 1) {
        temp = document.getElementById('js--timer');
        temp.innerHTML = 0;
        endGame();
        return;
    }
    
    seconds--;
    temp = document.getElementById('js--timer');
    temp.innerHTML = seconds;

    timeoutMyOswego = setTimeout(countdown, 1000);
}

function endGame() {
	clearTimeout(timeoutMyOswego); // Detiene el temporizador

	document.getElementById('js--question-controls').classList.add('hidden');
	document.getElementById('js--pa-controls').classList.remove('hidden');
	document.getElementById('js--end-title').innerHTML = 'Fin de partida!';
	document.getElementById('js--end-subtitle').innerHTML = showUserScore();
	document.getElementById('js--close').classList.add('hidden');
}

function showUserScore() {
	let counter = 0;
	for (let i = 0; i < words.length; i++) {
		if (words[i].correct == true) {
			counter++;
		}
	}

	return "Has conseguido un total de " + counter + " acierto" + (counter == 1 ? '' : 's') + '.';
}


// Main Program
// ----------------------------------------------------------------------------- */

// New game
let count = 0; // Counter for answered words
$("#js--new-game").click(function() {
	$("#js--ng-controls").addClass("hidden");
	$("#js--question-controls").removeClass("hidden");
	$("#js--close").removeClass("hidden");
	showDefinition(count);
	countdown();
});

// Send the answer
$("#js--send").click(function() {
	checkAnswer(count);
	continuePlaying();
});

// Key bindings for send the answer
$("#js--question-controls").keypress(function(event) {
	let keycode = (event.keyCode ? event.keyCode : event.which);
	if (keycode == "13") {
		checkAnswer(count);
		continuePlaying();
	}
});

// Skip the word
$("#js--pasapalabra").click(function() {
	pasapalabra(count);
	continuePlaying();
});

// Key bindings for skip the word
$("#js--question-controls").keypress(function(event) {
	let keycode = (event.keyCode ? event.keyCode : event.which);
	if (keycode == "32") {
		pasapalabra(count);
		continuePlaying();
	}
});

// Play again
$("#js--pa").click(function() {
	location.reload()
});

// End the game
$("#js--close").click(function() {
	endGame();
});

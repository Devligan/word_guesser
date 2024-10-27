//Used ChatGPT to debug and make code neater
let help = "";
let words = [];
let word = '';
let gameActive = true;

async function fetchData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/charlesreid1/five-letter-words/master/sgb-words.txt');
        words = (await response.text()).split('\n');
    } catch (error) {
        displayFeedback('Error fetching word list. Please try again.');
        console.error('Error fetching sgb-words.txt:', error);
    }
}

async function getRandomWord() {
    await fetchData();
    return words[Math.floor(Math.random() * words.length)];
}

function initializeGame() {
    getRandomWord().then(randomWord => {
        word = randomWord;
        console.log('Word is ' + word);
        displayFeedback('A new game has started! Try to guess the word.');
        gameActive = true;
    });
}

function displayFeedback(message) {
    let feedbackDiv = document.getElementById('feedback');
    feedbackDiv.textContent = message;
}

initializeGame();

function pushToHelp() {
    if (!gameActive) {
        displayFeedback('Game over. You guessed the word! Start a new game to play again.');
        return;
    }

    let y = document.getElementById('guessIn');
    help = y.value.trim();
    if (!words.includes(help)) {
        displayFeedback('Invalid word. Please enter a valid 5-letter word.');
        return;
    }
    if (help.length === 5) {
        displayFeedback('Checking your guess...');
        checkWordValidity(help);
    } else {
        displayFeedback('Your guess must be exactly 5 letters.');
    }
    y.value = "";
}

function checkWordValidity(guess) {
    try {
        let guessesDiv = document.getElementById('guesses');
        let coloredGuess = '';

        for (let i = 0; i < 5; i++) {
            let letter = guess[i];
            let feedbackClass = '';

            if (letter === word[i]) {
                feedbackClass = 'green';
            } else if (word.includes(letter)) {
                feedbackClass = 'yellow';
            } else {
                feedbackClass = 'gray';
            }

            coloredGuess += `<span class="${feedbackClass}">${letter}</span>`;
        }

        coloredGuess += '<br>';
        guessesDiv.innerHTML += coloredGuess;

        if (guess === word) {
            displayFeedback('Congratulations! You guessed the word!');
            gameActive = false;
        } else {
            displayFeedback('Keep trying!');
        }
    } catch (error) {
        displayFeedback('An error occurred while checking your guess.');
        console.error('Error checking word validity:', error);
    }
}

function startNewGame() {
    initializeGame();
    let guessesDiv = document.getElementById('guesses');
    guessesDiv.innerHTML = '';
    displayFeedback('A new game has started! Try to guess the word.');
}

document.addEventListener('DOMContentLoaded', (evt) => {
    document.getElementById('submit').addEventListener('click', (evt) => {
        evt.preventDefault();
        pushToHelp();
    });

    document.getElementById('newGame').addEventListener('click', (evt) => {
        startNewGame();
    });
});


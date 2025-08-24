// Setting the Game name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").textContent = gameName;
document.querySelector("footer").textContent = `Playing ${gameName}`;

// Make the game tries
let gameTries = 5;
let currentTry = 1;
let numberOfHints = 2; // Number of hints available
document.querySelector(".hints span").innerHTML = numberOfHints;
const words = ["Create", "Update", "Delete", "Master", "Branch", "Mainly", "Elzero", "School"];
// Randomly select a word from the words array
let wordToGuess = "";
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let numberOfLetters = wordToGuess.length;
let massagearea = document.querySelector(".message");
function generateInputs(){
    const inputscontainer = document.querySelector(".inputs");
    for (let i = 1; i <= gameTries; i++) {
        let tryElement = document.createElement("div");
        tryElement.classList.add (`try-${i}`);
        tryElement.innerHTML = `<span> Try ${i}</span>`;
        if (i !== 1) tryElement.classList.add ("disabled-inputs");
        for (let j = 0; j < numberOfLetters; j++) {
            const letterElement = document.createElement("input");
            letterElement.type = "text";
            letterElement.id = `guess-${i}-letter-${j}`;
            letterElement.maxLength = 1;
            letterElement.classList.add("letter");
            tryElement.appendChild(letterElement);
        }
        inputscontainer.appendChild(tryElement);
    }
    inputscontainer.children[0].children[1].focus();
    // Disable All Inputs Except First
    const inputsIndisabledDivs = document.querySelectorAll(".disabled-inputs input");
    inputsIndisabledDivs.forEach((input) => {input.disabled = true;});
    const inputs= document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        input.addEventListener("input", function() {
            // Make inputs uppercase
            this.value = this.value.toUpperCase();
            // Check if the input is filled
            if (this.value.length === 1) {
                for (let i = index + 1; i < inputs.length; i++) {
                    if (inputs[i].value === "") {
                        inputs[i].focus();
                        break;
                    }
                }
            }
        });
        input.addEventListener("keydown", function(event) {
            const nextInput = inputs[index + 1];
            const prevInput = inputs[index - 1];
            if (event.key === "Backspace") {
                event.preventDefault();
                if (this.value === "") {
                    for (let i = index - 1; i >= 0; i--) {
                        if (inputs[i].value !== "" ) {
                            inputs[i].focus();
                            inputs[i].value = "";
                            break;
                        }
                    }
                }else {
                    this.value = "";
                }
            }
            if (event.key === "ArrowRight") {
                if (nextInput) {
                    nextInput.focus();
                }
            } else if (event.key === "ArrowLeft") {
                if (prevInput) {
                    prevInput.focus();
                }
            }
            
        });
    });
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", guessWord);
console.log(wordToGuess); // For debugging purposes, you can remove this later

function guessWord() {
    let success = true;
    for (let i = 0; i < numberOfLetters; i++) {
        const input = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letterToWrite = input.value.toLowerCase();
        const letterToGuess = wordToGuess[i];
        if (letterToWrite === letterToGuess) {
            input.classList.add("green");
        } else if (wordToGuess.includes(letterToWrite) && letterToWrite !== "") {
            input.classList.add("yellow");
            success = false;
        } else {
            input.classList.add("gray");
            success = false;
        }
    }
    if (success) {
        massagearea.innerHTML = `Congratulations! You guessed the word! <span>${wordToGuess}</span>`;
        let alltries = document.querySelectorAll(".inputs > div");
        alltries.forEach((tryDiv) => {
            tryDiv.classList.add("disabled-inputs");
        });
        guessButton.disabled = true;
    } else {
        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
        const currentTryDiv = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryDiv.forEach((input) => {input.disabled = true;});

        currentTry++;
        const nextTryDiv = document.querySelectorAll(`.try-${currentTry} input`);
        if (currentTry > gameTries) {
            massagearea.innerHTML = `Game Over! The word was <span>${wordToGuess}</span>`;
            guessButton.disabled = true;
        } else {
            document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
            nextTryDiv.forEach((input) => {input.disabled = false;});
            nextTryDiv[0].focus();
        }
    }
}

const hintsButton = document.querySelector(".hints");
hintsButton.addEventListener("click", hintsButtonHandler);

function hintsButtonHandler() {
    if (numberOfHints > 0) {
        numberOfHints--;
        document.querySelector(".hints span").innerHTML = numberOfHints;
    } 
    if (numberOfHints === 0) {
        hintsButton.disabled = true;
        massagearea.innerHTML = "No more hints available!";
    }
    const enabledInputs = document.querySelectorAll(`input:not([disabled])`);
    const emptyenabledInputs = Array.from(enabledInputs).filter(input => input.value === "");
    
    if (emptyenabledInputs.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyenabledInputs.length);
        const randominput = emptyenabledInputs[randomIndex];
        const indextofill = Array.from(enabledInputs).indexOf(randominput);
        const wordtoGessexiptGessedOnse = Array.from(wordToGuess).filter((_, i) => i !== indextofill);
        const randomLetter = wordToGuess[indextofill];
        wordToGuess = wordtoGessexiptGessedOnse.join("");
        randominput.value = randomLetter.toUpperCase();
        randominput.classList.add("green");
        randominput.disabled = true;
        const nextInput = randominput[randomIndex + 1];  
        if (nextInput) {
            nextInput.focus();
        }
    }
}



window.onload = function() {
    generateInputs();
};
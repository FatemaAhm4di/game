"use strict"

function launchConfetti() {
    confetti({
        particleCount: 360,
        spread: 360,
        origin: { y: 0.5 }
    })
}

function saveScore(score) {
    let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    scores.push(score);
    scores.sort((a, b) => b - a);
    scores.slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(scores));
    renderLeaderBoard();
}

function renderLeaderBoard() {
    let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    const leaderboardEl = document.getElementById("leaderboard");
    leaderboardEl.innerHTML = scores.map(sc => `<li> ${sc} points </li>`).join("");
}
renderLeaderBoard();

let secretNumber;
let triesLeft = 5;

const messageEl = document.getElementById("message");
const hintEl = document.getElementById("hint");
const checkBtn = document.getElementById("checkBtn");
const restartBtn = document.getElementById("restartBtn");
const levelSelect = document.getElementById("level");

const soundCorrect = document.getElementById("sound-correct");
const soundWrong = document.getElementById("sound-wrong");
const soundClose = document.getElementById("sound-close");
const bgMusic = document.getElementById("bg-music");
bgMusic.volume = 0.05;


function generateSecretNumber() {
    const max = parseInt(levelSelect.value);
    secretNumber = Math.floor(Math.random() * max) + 1;
}
generateSecretNumber();

function resetGame() {
    generateSecretNumber();
    triesLeft = 5;
    document.getElementById("tries").innerHTML = triesLeft;
    messageEl.innerHTML = "";
    hintEl.innerHTML = "";
    document.getElementById("guess").value = "";
    checkBtn.disabled = false;
    renderLeaderBoard();
}

checkBtn.addEventListener("click", function () {
    let userGuess = parseInt(document.getElementById("guess").value);
    messageEl.className = "";
    hintEl.style.opacity = "1";

    if (!userGuess) {
        messageEl.innerText = "⚠️ Please enter a number!"
        hintEl.innerText = "";
        soundWrong.play();
        messageEl.classList.add("flash-red")
    }
    if (userGuess === secretNumber) {
        messageEl.innerText = "🎉 Correct! You win!"
        hintEl.innerText = "";
        soundCorrect.play();
        messageEl.classList.add("flash-green")
        checkBtn.disabled = true;
        let score = triesLeft * 10;
        saveScore(score);
        launchConfetti();
    }
    else {
        triesLeft--;
        document.getElementById("tries").innerText = triesLeft;

        if (triesLeft === 0) {
            messageEl.innerText = "💀 Game Over! the number was " + secretNumber;
            hintEl.innerText = "";
            soundWrong.play();
            messageEl.classList.add("flash-red")
            checkBtn.disabled = true;
        }
        else {
            messageEl.innerText = userGuess < secretNumber ? "Too low!" : "Too high!";
            let distance = Math.abs(userGuess - secretNumber);
            if (distance <= 2) {
                hintEl.innerText = "🔥 Very close!"
                soundClose.play();
            }
            else if (distance <= 5) {
                hintEl.innerText = "😊 Close!"
                soundWrong.play();
            }
            else {
                hintEl.innerText = "❄️ Far away!"
                soundWrong.play();
            }
        }
    }
})

restartBtn.addEventListener("click", resetGame);
levelSelect.addEventListener("change", resetGame);
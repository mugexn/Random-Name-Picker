const namesInput = document.getElementById('names-input');
const pickButton = document.getElementById('pick-button');
const resetButton = document.getElementById('reset-button');
const winnerDisplay = document.getElementById('winner-display');
const pickedList = document.getElementById('picked-list');
const noPickedNames = document.getElementById('no-picked-names');
const remainingCount = document.getElementById('remaining-count');

const backgroundMusic = document.getElementById('background-music');
const musicToggleButton = document.getElementById('music-toggle-button');

const timerInput = document.getElementById('timer-input');
const startTimerButton = document.getElementById('start-timer-button');
const timerDisplay = document.getElementById('timer-display');

let allNames = [];
let pickedNames = new Set();
let animationInterval;
let isMusicPlaying = false;
let countdownInterval;

function updateRemainingCount() {
    const namesFromInput = namesInput.value.split('\n').map(name => name.trim()).filter(name => name !== '');
    const unpickedNames = [...new Set(namesFromInput)].filter(name => !pickedNames.has(name));
    remainingCount.textContent = unpickedNames.length;
}

function pickRandomName() {
    const namesFromInput = namesInput.value.split('\n').map(name => name.trim()).filter(name => name !== '');
    
    allNames = [...new Set(namesFromInput)];

    const unpickedNames = allNames.filter(name => !pickedNames.has(name));

    if (unpickedNames.length === 0) {
        winnerDisplay.textContent = "All names have been picked!";
        winnerDisplay.classList.remove('spinning-text');
        clearInterval(animationInterval);
        return;
    }

    pickButton.disabled = true;

    let spinCount = 0;
    const animationDuration = 3000; 
    const spinRate = 50; 
    winnerDisplay.classList.add('spinning-text');

    animationInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * unpickedNames.length);
        winnerDisplay.textContent = unpickedNames[randomIndex];
        spinCount += spinRate;
        if (spinCount >= animationDuration) {
            clearInterval(animationInterval);
            revealWinner(unpickedNames);
        }
    }, spinRate);
}

function revealWinner(unpickedNames) {
    const randomIndex = Math.floor(Math.random() * unpickedNames.length);
    const winner = unpickedNames[randomIndex];
    
    winnerDisplay.textContent = winner;
    winnerDisplay.classList.remove('spinning-text');

    pickedNames.add(winner);

    updatePickedList();
    updateRemainingCount();

    pickButton.disabled = false;

    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function updatePickedList() {
    if (pickedNames.size > 0) {
        noPickedNames.classList.add('hidden');
        pickedList.innerHTML = ''; 
        pickedNames.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            li.className = 'text-gray-800 text-lg p-2 bg-gray-100 rounded-md';
            pickedList.appendChild(li);
        });
    } else {
        noPickedNames.classList.remove('hidden');
    }
}

function resetApp() {
    pickedNames.clear();
    allNames = [];
    namesInput.value = '';
    winnerDisplay.textContent = "Awaiting your names!";
    updatePickedList();
    updateRemainingCount();
    stopTimer(); 
}

function toggleMusic() {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        musicToggleButton.textContent = 'Play Music 🎵';
    } else {
        backgroundMusic.play();
        musicToggleButton.textContent = 'Stop Music 🔇';
    }
    isMusicPlaying = !isMusicPlaying;
}

function startTimer() {
    let timeLeft = parseInt(timerInput.value, 10);
    if (isNaN(timeLeft) || timeLeft <= 0) {
        alert("Please enter a valid number of seconds for the timer.");
        return;
    }

    startTimerButton.disabled = true;
    timerDisplay.textContent = `${timeLeft}s`;

    countdownInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `${timeLeft}s`;

        if (timeLeft <= 0) {
            stopTimer();
            timerDisplay.textContent = "Time's up!";
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(countdownInterval);
    startTimerButton.disabled = false;
}

pickButton.addEventListener('click', pickRandomName);
resetButton.addEventListener('click', resetApp);
namesInput.addEventListener('input', updateRemainingCount);
musicToggleButton.addEventListener('click', toggleMusic);
startTimerButton.addEventListener('click', startTimer);

updateRemainingCount();
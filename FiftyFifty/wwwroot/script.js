let countA = 0;
let countB = 0;

let timer = 0;
let intervalId = null;

// Grab the Elements
const counterA = document.getElementById('counterA');
const counterB = document.getElementById('counterB');
const timerDisplay = document.getElementById('timer');
const balanceProgress = document.getElementById('balanceProgress');
const totalClickCount = document.getElementById('totalClickCount');

document.addEventListener('DOMContentLoaded', async () => {
    await updateCounters();
});

let connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5138/clickHub")
    .build();

// Start connection to SignalR hub
connection.start().catch(err => console.error(err.toString()));

connection.on("RecieveClickCounts", (counts) => {
    countA = counts.CountA;
    countB = counts.CountB;
    updateCounters(); // Update the UI with the new counts
});

// Start Timer
function startTimer() {
    intervalId = setInterval(() => {
        timer++;
        timerDisplay.innerText = new Date(timer * 1000).toISOString().substring(11,19);
    }, 1000);
}

// Stop Timer
function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
}

// Reset Everything on Page Load
// updateCounters();

async function updateCounters() {
    let response = await fetch('http://localhost:5138/api/click');
    let data = await response.json();

    countA = data.countA;
    countB = data.countB;
    timer = data.timerValue

    totalClicks = countA + countB;

    counterA.innerText = data.countA;
    counterB.innerText = data.countB;
    totalClickCount.innerText = totalClicks;

    updateBalanceProgress();

    if (data.countA === data.countB) {
        if (!intervalId) startTimer();
    } else {
        stopTimer();
    }

    timerDisplay.innerText = new Date(timer * 1000).toISOString().substring(11, 19);
}

document.getElementById('buttonA').addEventListener('click', async () => {
    await fetch('http://localhost:5138/api/click/clickA', { method: 'POST'});
    updateCounters();
});

// Calculate and Update the Balance Bar
function updateBalanceProgress() {
    let maxCount = Math.max(countA, countB);
    let minCount = Math.min(countA, countB);

    let balancePercentage = 100; // Default to 100% when they are equal

    if (maxCount !== 0) {
        balancePercentage = Math.floor((minCount / maxCount) * 100)
    }

    balanceProgress.style.width = `${balancePercentage}%`;
    balanceProgress.setAttribute(`aria-valuenow`, balancePercentage);
    balanceProgress.innerText = `${balancePercentage}% Balanced`;
}

document.getElementById('buttonB').addEventListener('click', async () => {
    await fetch('http://localhost:5138/api/click/clickB', { method: 'POST'});
    updateCounters();
});

document.addEventListener('DOMContentLoaded', () => {
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80
            },
            "color": {
                "value": "#9BBA9D"
            },
            "shape": {
                "type": "circle"
            },
            "opacity": {
                "value": 0.5
            },
            "size": {
                "value": 3
            },
            "move": {
                "enable": true,
                "speed": 2
            }
        },
        "retina_detect": true
    });
});

// document.addEventListener('click', (event) => {
//     // Update the total click count for all clicks, including those outside buttons
//     if (event.target !== buttonA && event.target !== buttonB) {
//         totalClicks++;
//         totalClickCount.innerText = totalClicks;
//     }
// });

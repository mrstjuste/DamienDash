// Access the game character and relevant game elements from the DOM
const Damien = document.getElementById("Damien");
const gameContainer = document.querySelector('.game');
const timerDisplay = document.getElementById("timer");

// Initialize the game state variables
let startTime = Date.now(); // Record the start time of the game
let gameRunning = true; // Flag to keep track of whether the game is still running

// Function to handle the jump action of the player character
function jump() {
    // Check if Damien already has the 'jump' class to prevent double-jumping
    if (!Damien.classList.contains("jump")) {
        Damien.classList.add("jump"); // Add 'jump' class to Damien
        setTimeout(function () {
            Damien.classList.remove("jump"); // Remove 'jump' class after 300ms
        }, 300);
    }
}

// Function to create and manage obstacles
function createObstacle(type) {
    const obstacle = document.createElement('div'); // Create a new div for the obstacle
    obstacle.classList.add('obstacle', type); // Add classes for general and specific styling

    // Set the background image based on the type of obstacle
    switch (type) {
        case 'UA':
            obstacle.style.backgroundImage = "url('UA.gif')";
            break;
        case 'UAKNOW':
            obstacle.style.backgroundImage = "url('UAKNOW.gif')";
            break;
        case 'ARROW':
            obstacle.style.backgroundImage = "url('ARROW.gif')";
            break;
        default:
            obstacle.style.backgroundImage = "url('default.gif')"; // Default case
    }

    obstacle.style.right = '-100px'; // Start the obstacle off-screen
    gameContainer.appendChild(obstacle); // Add the obstacle to the game container

    // Function to move the obstacle from right to left
    let moveObstacle = setInterval(function () {
        if (!gameRunning) {
            clearInterval(moveObstacle); // Stop moving the obstacle if the game has ended
            gameContainer.removeChild(obstacle); // Remove the obstacle from the DOM
        } else {
            let obstaclePosition = parseInt(window.getComputedStyle(obstacle).getPropertyValue("right"));
            obstaclePosition += 5; // Move the obstacle by 5px
            obstacle.style.right = `${obstaclePosition}px`;

            let DamienTop = parseInt(window.getComputedStyle(Damien).getPropertyValue("top"));
            // Check for collision between Damien and the obstacle
            if (obstaclePosition > 500 && obstaclePosition < 550 && DamienTop >= 140) {
                alert("Game Over!"); // Alert game over
                gameRunning = false; // Set game running to false
                clearInterval(moveObstacle); // Clear interval
                clearInterval(timerInterval); // Clear the timer interval
            }
        }
    }, 50);
}

// Function to spawn obstacles randomly
function randomObstacleSpawn() {
    if (gameRunning) {
        const types = ['UA', 'UAKNOW', 'ARROW']; // Types of obstacles
        const type = types[Math.floor(Math.random() * types.length)];
        createObstacle(type);
        // Set a random time for spawning the next obstacle
        setTimeout(randomObstacleSpawn, Math.random() * 2000 + 1000);
    }
}

// Function to update the game timer
function updateTimer() {
    if (gameRunning) {
        let elapsed = (Date.now() - startTime) / 1000; // Calculate elapsed time in seconds
        timerDisplay.textContent = `Time: ${elapsed.toFixed(2)}s`; // Display the elapsed time
    }
}

// Event listener for keyboard actions
document.addEventListener("keydown", function (event) {
    // Trigger jump when space bar or arrow up key is pressed
    if (event.code === "Space" || event.code === "ArrowUp") {
        jump();
    }
});

// Initialize the timer to update every 100 milliseconds
let timerInterval = setInterval(updateTimer, 100);

// Start spawning obstacles as soon as the game loads
randomObstacleSpawn();

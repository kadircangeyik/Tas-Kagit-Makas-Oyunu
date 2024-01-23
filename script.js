(function () {
    const Hands = {
        Rock: 0,
        Paper: 1,
        Scissor: 2,
        Lizard: 3,
        Spock: 4
    };
    let scores = [0, 0];
    let maxGames = 10;
    let gamesPlayed = 0;
    let gameFinished = false;

    const buttons = document.querySelectorAll(".cs-hand");
    const playerNode1 = document.querySelector(".cs-computer .cs-player-1");
    const playerNode2 = document.querySelector(".cs-computer .cs-player-2");
    const scoreNode1 = document.querySelector(".cs-score-1");
    const scoreNode2 = document.querySelector(".cs-score-2");
    const boardNode = document.querySelector(".cs-computer");
    const winLoseNode = document.querySelector(".cs-win-lose");
    const playBtn = document.querySelector(".cs-play-btn");
    const gameNumber = document.querySelector(".cs-game-number");

    let boardTimeout = null;

    function playGame() {
        console.log("Game started");

        resetGame();

        Array.from(buttons).forEach((button) =>
            button.addEventListener("click", runHand)
        );

        playBtn.addEventListener("click", () => {
            resetGame();
        });
    }

    function runHand(e) {
        if (gameFinished) {
            return;
        }
        const target = e.currentTarget;
        const userChoice = parseInt(target.dataset.hand);
        const computerChoice = getComputerHand();
        displayHands(userChoice, computerChoice);

        target.classList.add("clicked");
        setTimeout(() => target.classList.remove("clicked"), 200);

        determineWinner(userChoice, computerChoice);

        updateGameStatus();
        checkGameOver();
    }

    function displayHands(userChoice, computerChoice) {
        popHand(playerNode1, userChoice);
        popHand(playerNode2, computerChoice);
    }

    function determineWinner(userChoice, computerChoice) {
        if (userChoice === computerChoice) {
            // Tie
            animateBoard("tie");
            return;
        }

        const winningCombos = [
            [Hands.Paper, Hands.Rock],
            [Hands.Rock, Hands.Scissor],
            [Hands.Scissor, Hands.Paper],
            [Hands.Rock, Hands.Lizard],
            [Hands.Lizard, Hands.Spock],
            [Hands.Spock, Hands.Scissor],
            [Hands.Scissor, Hands.Lizard],
            [Hands.Lizard, Hands.Paper],
            [Hands.Paper, Hands.Spock],
            [Hands.Spock, Hands.Rock]
        ];

        if (winningCombos.some(combo => combo[0] === userChoice && combo[1] === computerChoice)) {
            
            animateBoard("win");
            updateScore(0);
        } else {
            
            animateBoard("lose");
            updateScore(1);
        }
    }

    function updateGameStatus() {
        gameNumber.innerHTML = `${++gamesPlayed} / ${maxGames}`;
    }

    function checkGameOver() {
        const [userScore, computerScore] = scores;

        if (gamesPlayed >= maxGames) {
            gameFinished = true;
            if (userScore === computerScore) {
                endGame("It's a draw!", "tie");
            } else if (userScore > computerScore) {
                endGame("You win!", "win");
            } else {
                endGame("You lost!", "lose");
            }
        }
    }

    function endGame(message, state) {
        boardNode.classList.add("hidden");
        winLoseNode.querySelector("p").innerHTML = message;
        winLoseNode.classList.remove("hidden");
        winLoseNode.classList.add(state);
        gameNumber.innerHTML = `${gamesPlayed} / ${maxGames}`;
    }

    function resetGame() {
        scores = [0, 0];
        gamesPlayed = 0;
        gameFinished = false;

        renderScore(scoreNode1, 0);
        renderScore(scoreNode2, 0);

        popHand(playerNode1, 0);
        popHand(playerNode2, 0);

        boardNode.classList.remove("hidden");
        winLoseNode.setAttribute("class", "cs-win-lose hidden");
        gameNumber.innerHTML = `${gamesPlayed} / ${maxGames}`;
    }

    function popHand(node, choice) {
        node.classList.add("enter");
        node.setAttribute("data-choice", choice);
        setTimeout(() => node.classList.remove("enter"), 400);
    }

    function animateBoard(state) {
        clearTimeout(boardTimeout);
        boardNode.setAttribute("class", "cs-computer");
        boardNode.classList.add(state);
        boardTimeout = setTimeout(() => boardNode.classList.remove(state), 900);
    }

    function getComputerHand() {
        return Math.floor(Math.random() * Object.keys(Hands).length);
    }

    function renderScore(node, value) {
        node.querySelector("span").innerHTML = value;
    }

    function updateScore(playerIndex) {
        renderScore(playerIndex === 0 ? scoreNode1 : scoreNode2, ++scores[playerIndex]);
    }

    playGame();
})();


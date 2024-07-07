document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('[data-cell]');
    const X_CLASS = 'x';
    const O_CLASS = 'o';
    let oTurn;
    const WINNING_COMBINATIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    const restartButton = document.getElementById('restartButton');
    const aiButton = document.getElementById('aiButton');
    let againstAI = false;

    restartButton.addEventListener('click', startGame);
    aiButton.addEventListener('click', () => {
        againstAI = !againstAI;
        aiButton.textContent = againstAI ? 'Play Against Human' : 'Play Against AI';
        startGame();
    });

    startGame();

    function startGame() {
        oTurn = false;
        cells.forEach(cell => {
            cell.classList.remove(X_CLASS);
            cell.classList.remove(O_CLASS);
            cell.textContent = '';
            cell.removeEventListener('click', handleClick);
            cell.addEventListener('click', handleClick, { once: true });
        });
    }

    function handleClick(e) {
        const cell = e.target;
        const currentClass = oTurn ? O_CLASS : X_CLASS;
        placeMark(cell, currentClass);
        if (checkWin(currentClass)) {
            setTimeout(() => alert(`${currentClass.toUpperCase()} wins!`), 10);
            setTimeout(startGame, 2000);
        } else if (isDraw()) {
            setTimeout(() => alert('Draw!'), 10);
            setTimeout(startGame, 2000);
        } else {
            swapTurns();
            if (againstAI && !oTurn) {
                makeAIMove();
            }
        }
    }

    function placeMark(cell, currentClass) {
        cell.classList.add(currentClass);
        cell.textContent = currentClass.toUpperCase();
    }

    function swapTurns() {
        oTurn = !oTurn;
    }

    function checkWin(currentClass) {
        return WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => {
                return cells[index].classList.contains(currentClass);
            });
        });
    }

    function isDraw() {
        return [...cells].every(cell => {
            return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
        });
    }

    function makeAIMove() {
        const bestMove = minimax([...cells], O_CLASS).index;
        const cell = cells[bestMove];
        cell.click();
    }

    function minimax(newBoard, player) {
        const availSpots = newBoard.filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS));

        if (checkWin(O_CLASS)) {
            return { score: 10 };
        } else if (checkWin(X_CLASS)) {
            return { score: -10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];
        availSpots.forEach((cell, index) => {
            const move = {};
            move.index = newBoard.indexOf(cell);
            newBoard[move.index].classList.add(player);

            if (player === O_CLASS) {
                move.score = minimax(newBoard, X_CLASS).score;
            } else {
                move.score = minimax(newBoard, O_CLASS).score;
            }

            newBoard[move.index].classList.remove(player);
            moves.push(move);
        });

        let bestMove;
        if (player === O_CLASS) {
            let bestScore = -Infinity;
            moves.forEach((move, index) => {
                if (move.score > bestScore) {
                    bestScore = move.score;
                    bestMove = index;
                }
            });
        } else {
            let bestScore = Infinity;
            moves.forEach((move, index) => {
                if (move.score < bestScore) {
                    bestScore = move.score;
                    bestMove = index;
                }
            });
        }

        return moves[bestMove];
    }
});

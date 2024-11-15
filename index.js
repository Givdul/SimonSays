class SimonGame {
    constructor() {
        this.gridSize = 3;
        this.sequence = [];
        this.playerSequence = [];
        this.isPlaying = false;
        this.score = 0;
        this.cells = [];
        this.initializeGrid();
        this.bindEvents();
    }

    initializeGrid() {
        const grid = document.getElementById('grid');
        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            this.cells.push(cell);
            grid.appendChild(cell);
        }
    }

    bindEvents() {
        document.getElementById('startButton').addEventListener('click', () => this.startGame());
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });
    }

    async startGame() {
        this.cells.forEach(cell => cell.classList.remove('wrong'));
        const gameOverModal = document.getElementById('gameOverModal');
        gameOverModal.style.display = 'none';
        await this.delay(600);
        this.sequence = [];
        this.score = 0;
        this.updateScore();
        this.isPlaying = true;
        await this.nextRound();
    }

    async nextRound() {
        this.playerSequence = [];
        this.sequence.push(Math.floor(Math.random() * (this.gridSize * this.gridSize)));
        await this.showSequence();
    }

    async showSequence() {
        const startButton = document.getElementById('startButton');
        startButton.disabled = true;

        for (let index of this.sequence) {
            await this.highlightCell(index);
            await this.delay(300);
        }
    }

    async highlightCell(index) {
        const cell = this.cells[index];
        cell.classList.add('highlight');
        await this.delay(300);
        cell.classList.remove('highlight');
    }

    async handleCellClick(event) {
        if (!this.isPlaying) return;

        const clickedIndex = parseInt(event.target.dataset.index);
        this.playerSequence.push(clickedIndex);
        const currentIndex = this.playerSequence.length - 1;

        if (this.sequence[currentIndex] !== clickedIndex) {
            this.gameOver(currentIndex);
            return;
        }

        this.cells[clickedIndex].classList.add('flash');
        await this.delay(300);
        this.cells[clickedIndex].classList.remove('flash');

        if (this.playerSequence.length === this.sequence.length) {
            await this.delay(450);
            this.cells.forEach(cell => {
                cell.classList.add('flash');
            });
            await this.delay(300);
            this.cells.forEach(cell => {
                cell.classList.remove('flash');
            });

            this.score++;
            this.updateScore();
            setTimeout(() => this.nextRound(), 1000);
        }
    }

    async gameOver(wrongIndex) {
        this.isPlaying = false;
        if (wrongIndex !== undefined) {
            this.cells[this.sequence[wrongIndex]].classList.add('wrong');
        }
        await this.delay(600);
        const gameOverModal = document.getElementById('gameOverModal');
        const highScoreElement = document.getElementById('highScore');
        gameOverModal.style.display = 'flex';
        highScoreElement.textContent = this.score;
        const startButton = document.getElementById('startButton');
        startButton.disabled = false;
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new SimonGame();
});
class DiceGame {
    constructor() {
        this.points = 5000;
        this.gameCost = 500;
        this.roundsPlayed = 0;
        this.dices = [];
        this.selectedDices = [];
        
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.pointsDisplay = document.getElementById('points');
        this.roundsDisplay = document.getElementById('roundsPlayed');
        this.diceContainer = document.getElementById('diceContainer');
        this.resultDisplay = document.getElementById('result');
        this.rollButton = document.getElementById('rollButton');
        this.selectButton = document.getElementById('selectButton');
        this.rerollButton = document.getElementById('rerollButton');
        this.playAgainButton = document.getElementById('playAgainButton');
        
        this.frequencyTds = Array.from({length: 8}, (_, i) => 
            document.getElementById(`freq${i}`));
    }

    setupEventListeners() {
        this.rollButton.addEventListener('click', () => this.rollDices());
        this.selectButton.addEventListener('click', () => this.selectDices());
        this.rerollButton.addEventListener('click', () => this.rerollUnselectedDices());
        this.playAgainButton.addEventListener('click', () => this.resetGame());
    }

    rollDices() {
        if (this.points < this.gameCost) {
            alert('Not enough points to play!');
            return;
        }

        this.points -= this.gameCost;
        this.pointsDisplay.textContent = this.points;
        this.roundsPlayed++;
        this.roundsDisplay.textContent = this.roundsPlayed;

        this.dices = Array.from({length: 7}, () => Math.floor(Math.random() * 6) + 1);
        this.renderDices();
        this.rollButton.style.display = 'none';
        this.selectButton.style.display = 'block';
        this.resultDisplay.textContent = '';
    }

    renderDices() {
        this.diceContainer.innerHTML = '';
        this.dices.forEach((value, index) => {
            const diceElement = document.createElement('div');
            diceElement.classList.add('dice');
            diceElement.textContent = value;
            diceElement.addEventListener('click', () => this.toggleDiceSelection(index));
            this.diceContainer.appendChild(diceElement);
        });
    }

    toggleDiceSelection(index) {
        const diceElement = this.diceContainer.children[index];
        diceElement.classList.toggle('selected');
        
        if (diceElement.classList.contains('selected')) {
            this.selectedDices.push(index);
        } else {
            this.selectedDices = this.selectedDices.filter(i => i !== index);
        }
    }

    selectDices() {
        this.selectButton.style.display = 'none';
        this.rerollButton.style.display = 'block';
    }

    rerollUnselectedDices() {
        this.dices = this.dices.map((value, index) => 
            this.selectedDices.includes(index) ? value : Math.floor(Math.random() * 6) + 1
        );
        this.renderDices();
        this.calculateResults();
        this.rerollButton.style.display = 'none';
        this.playAgainButton.style.display = 'block';
    }

    calculateResults() {
        const fiveCount = this.dices.filter(d => d === 5).length;
        const frequencies = this.frequencyTds.map(td => parseInt(td.textContent));
        frequencies[fiveCount]++;
        
        this.frequencyTds.forEach((td, i) => {
            td.textContent = frequencies[i];
        });

        const prizeMultipliers = [0, 1, 2, 3, 4, 5, 6, 10];
        const prize = this.gameCost * prizeMultipliers[fiveCount];
        this.points += prize;
        this.pointsDisplay.textContent = this.points;

        this.resultDisplay.textContent = 
            `You rolled ${fiveCount} five(s). Prize: ${prize} points!`;
    }

    resetGame() {
        this.selectedDices = [];
        this.diceContainer.innerHTML = '';
        this.resultDisplay.textContent = '';
        this.rollButton.style.display = 'block';
        this.selectButton.style.display = 'none';
        this.rerollButton.style.display = 'none';
        this.playAgainButton.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DiceGame();
});

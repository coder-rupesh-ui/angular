import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="game-container" tabindex="0">
      <div *ngFor="let square of grid" class="square" [ngClass]="{'snake': square.isPartOfSnake}"></div>
    </div>
  `,
  styles: [`
    .game-container {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      grid-template-rows: repeat(10, 1fr);
    }

    .square {
      background-color: #f2f2f2;
      border: 1px solid #ccc;
      width: 40px;
      height: 40px;
    }

    .snake {
      background-color: #ff00ff;
    }
  `]
})
export class AppComponent {
  grid: any[];
  snake: any[];
  direction: string;
  intervalId: any;

  @HostListener('window:keydown', ['$event'])
  changeDirection(event: KeyboardEvent) {
    if (event.code === 'ArrowLeft' && this.direction !== 'right') {
      this.direction = 'left';
    } else if (event.code === 'ArrowUp' && this.direction !== 'down') {
      this.direction = 'up';
    } else if (event.code === 'ArrowRight' && this.direction !== 'left') {
      this.direction = 'right';
    } else if (event.code === 'ArrowDown' && this.direction !== 'up') {
      this.direction = 'down';
    }
  }

  constructor() {
    this.grid = Array(100).fill(null).map((_, i) => {
      return {
        id: i,
        isPartOfSnake: false
      };
    });

    this.snake = [
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: 0, y: 2},
    ];

    this.direction = 'right';
    this.intervalId = setInterval(() => this.updateSnake(), 1000);
  }

  updateSnake() {
    const head = this.snake[0];
    let newHead: any;

    if (this.direction === 'right') {
      newHead = {x: head.x, y: head.y + 1};
    } else if (this.direction === 'left') {
      newHead = {x: head.x, y: head.y - 1};
    } else if (this.direction === 'up') {
      newHead = {x: head.x - 1, y: head.y};
    } else if (this.direction === 'down') {
      newHead = {x: head.x + 1, y: head.y};
    }

    // Check for collision at the edges of the grid
    if (newHead.x < 0 || newHead.x >= 10 || newHead.y < 0 || newHead.y >= 10) {
      // Handle the collision (e.g. stop the game, show a message)
      clearInterval(this.intervalId);
      alert("Game Over!");
      return;
    }
    this.snake.unshift(newHead);
    this.snake.pop();
    this.updateGrid();
  }


  updateGrid() {
    this.grid.forEach(square => {
      square.isPartOfSnake = false;
    });

    this.snake.forEach(segment => {
      const square = this.grid[segment.x * 10 + segment.y];
      square.isPartOfSnake = true;
    });
  }
}

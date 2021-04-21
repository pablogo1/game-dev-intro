import gameEngine from './gameEngine.js';
import game from './game.js';

let gameController = new gameEngine.GameController();
let ball = new game.Ball(0, 0);
gameController.addGameObject(ball);

document.getElementById("startButton").addEventListener("click", () => { gameController.start(); });
document.getElementById("stopButton").addEventListener("click", () => { gameController.stop(); });
document.addEventListener("keydown", (eventArgs) => {
    console.debug(`Key entered: ${eventArgs.key}`);

    if (eventArgs.key == "ArrowUp") {
        ball.moveUp();
    } else if (eventArgs.key == "ArrowDown") {
        ball.moveDown();
    } else if (eventArgs.key == "ArrowLeft") {
        ball.moveLeft();
    } else if (eventArgs.key == "ArrowRight") {
        ball.moveRight();
    }
});
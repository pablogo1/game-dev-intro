import gameEngine from './gameEngine.js';
import game from './game.js';

let gameController = new gameEngine.GameController();
let ball = new game.Ball(0, 0);
gameController.addGameObject(ball);

document.getElementById("startButton").addEventListener("click", () => { gameController.start(); });
document.getElementById("stopButton").addEventListener("click", () => { gameController.stop(); });
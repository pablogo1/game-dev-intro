let gameEngine = (function (document) {
    var interval = 20;

    class Point {
        constructor (x, y) {
            this._x = x;
            this._y = y;
        }

        setPoint(x, y) {
            this.x = x;
            this.y = y;
        }

        get x () {
            return this._x;
        }

        set x (val) {
            this._x = val;
        }

        get y () {
            return this._y;
        }

        set y (val) {
            this._y = val;
        }
    }

    class GameObject {
        constructor (startPosition) {
            this._startPos = startPosition;
            this._currentPos = startPosition;
        }

        update () {
            this._currentPos.x = this._currentPos.x + 1;
            this._currentPos.y = this._currentPos.y + 1;
        }

        draw (context) {
            
        }

        reset () {
            this._currentPos = this._startPos;
        }
    }

    class GameController {
        constructor () {
            this.canvas = null;
            this._gameObjects = [];
            
            this.canvas = document.createElement("canvas");
            this.canvas.width = 480;
            this.canvas.height = 320;
            this.context = this.canvas.getContext("2d");
    
            var container = document.getElementById("gameAreaContainer");
            container.appendChild(this.canvas);
        }

        start () {
            console.log("start game");

            for (let element of this._gameObjects) {
                element.reset();
            }
            
            this._intervalHandle = setInterval(() => {
                this.updateGameArea();
            }, interval);
        }

        stop () {
            clearInterval(this._intervalHandle);
            console.log("game stopped.");
        }

        addGameObject (gameObj) {
            this._gameObjects.push(gameObj);
        }

        updateGameArea() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (let element of this._gameObjects) {
                element.update();
                element.draw(this.context);
            }
        }
    }

    // var obj = new GameController();

    return {
        'GameController': GameController,
        'GameObject': GameObject,
        'Point': Point
    };
})(document);

export default gameEngine;
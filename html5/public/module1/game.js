import gameEngine from './gameEngine.js';

let game = (function (ge) {
    class Ball extends ge.GameObject {
        constructor (startX, startY) {
            super(new ge.Point(startX, startY));
        }

        update () {
            this._currentPos.x = this._currentPos.x + 1;
            this._currentPos.y = this._currentPos.y + 0.2;
        }

        draw (context) {
            context.beginPath();
            context.fillStyle = "red";
            context.arc(this._currentPos.x, this._currentPos.y, 25, 0, 2 * Math.PI);
            context.fill();
        }
    }

    return {
        'Ball': Ball
    };
})(gameEngine);

export default game;
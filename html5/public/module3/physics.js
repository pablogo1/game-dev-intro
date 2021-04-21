const radians_to_degrees = 180 / Math.PI;
const degrees_to_radians = Math.PI / 180;

function degrees (rad) {
    return rad * radians_to_degrees;
}

function radians (deg) {
    return deg * degrees_to_radians;
}

class Matrix {
    constructor (innerArray) {
        this._innerArray = innerArray;
        this._dimensions = {
            rows: this._innerArray.length,
            columns: this._innerArray[0].length
        };
    }

    getAt(row, column) {
        if (row < 0 || row >= this._innerArray.length) {
            throw new Error(`row '${row}' is out of range.`);
        }
        if (column < 0 || column >= this._innerArray[0].length) {
            throw new Error(`column '${column}' is out of range.`);
        }

        return this._innerArray[row][column];
    }

    setValueAt(value, row, column) {
        if (row < 0 || row >= this._innerArray.length) {
            throw new Error(`row '${row}' is out of range.`);
        }
        if (column < 0 || column >= this._innerArray[0].length) {
            throw new Error(`column '${column}' is out of range.`);
        }

        this._innerArray[row][column] = value;
    }

    get dimensions() {
        return this._dimensions;
    }

    scalarMultiplication (scalar) {
        scalar = Number(scalar);
        if (isNaN(scalar)) {
            throw new TypeError("scalar expected to be a number.");
        }

        for (let i = 0; i < this.dimensions.rows; i++) {
            for (let j = 0; j <= this.dimensions.columns; j++) {
                this._innerArray[i][j] = +(this._innerArray[i][j] * scalar).toFixed(12);
            }
        }
    }

    static vector2d (i, j) {
        i = Number(i);
        j = Number(j);

        if (isNaN(i) || isNaN(j)) {
            throw new TypeError('Both i and j are expected to be numbers.');
        }

        let array = [[]];
        array[0] = new Float64Array([i]);
        array[1] = new Float64Array([j]);

        return new Matrix(array);
    }
    
    static empty(n, m) {
        n = Number(n);
        m = Number(m);

        if (!Number.isInteger(n) || !Number.isInteger(m) || n <= 0 || m <= 0) {
            throw new RangeError('Both n and m must be positive integers greater or equal than 1.');
        }

        let array = [[]];
        for (var i = 0; i < n; i++) {
            array[i] = new Float64Array(n);
        }
        return new Matrix (array);
    }

    static identity(n) {
        n = Number(n);

        if (!Number.isInteger(n) || n <= 0) {
            throw new RangeError('Parameter n must be positive integer greater or equal than 1.');
        }

        let array = [[]];
        for (var i = 0; i < n; i++) {
            array[i] = new Float64Array(n);
            array[i][i] = 1;
        }

        return new Matrix (array);
    }

    static sum (m1, m2) {
        if (m1.dimensions.rows != m2.dimensions.rows || m1.dimensions.columns != m2.dimensions.columns) {
            throw new Error('Matrices are not of the same size.');
        }

        let result = [[]];
        for (var i = 0; i < m1.dimensions.rows; i++) {
            result[i] = new Float64Array(m1.dimensions.columns);
            for (var j = 0; j < m1.dimensions.columns; j++) {
                result[i][j] = +(m1.getAt(i, j) + m2.getAt(i, j)).toFixed(12);
            }
        }

        return new Matrix(result);
    }

    static substract (m1, m2) {
        if (m1.dimensions.rows != m2.dimensions.rows || m1.dimensions.columns != m2.dimensions.columns) {
            throw new Error('Matrices are not of the same size.');
        }

        let result = [[]];
        for (var i = 0; i < m1.dimensions.rows; i++) {
            result[i] = [];
            for (var j = 0; j < m1.dimensions.columns; j++) {
                result[i][j] = m1.getAt(i, j) - m2.getAt(i, j);
            }
        }

        return new Matrix(result);
    }

    static isMatrix(obj) {
        return obj instanceof Matrix;
    }

    static [Symbol.hasInstance](obj) {
        if (obj._innerArray) {
            return true;
        }
        return false;
    }
}

class Vector2d {
    constructor (vectorMatrix) {
        if (!(vectorMatrix instanceof Matrix)) {
            throw new TypeError("Expect Matrix instance.");
        }

        this._vector2d = vectorMatrix;
    }

    get magnitude () {
        return Math.sqrt(this.i * this.i + this.j * this.j);
    }

    get i () {
        return this._vector2d.getAt(0, 0);
    }

    get j () {
        return this._vector2d.getAt(1, 0);
    }

    scalarMultiplication (scalar) {
        this._vector2d.scalarMultiplication(scalar);
    }

    static from (magnitude, angle = 0) {
        magnitude = Number(magnitude);
        angle = Number(angle);

        if (isNaN(magnitude) || isNaN(angle)) {
            throw new TypeError('Both magniture and angle are expected number');
        }

        let x = magnitude * Math.cos(radians(angle));
        let y = magnitude * Math.sin(radians(angle));

        return new Vector2d (Matrix.vector2d(x, y));
    }

    static fromComponents (i, j) {
        return new Vector2d (Matrix.vector2d(i, j));
    }

    static parse (obj) {
        let number = parseFloat(obj);
        
        if (!isNaN(number)) {
            return this.from(number);
        }

        if (Array.isArray(obj)) {
            if (obj.length >= 2) {
                return this.fromComponents(obj[0], obj[1]);
            }
        }

        if (obj instanceof Vector2d) {
            return obj;
        }

        return undefined;
        // throw new TypeError('expected number, array or instance of Vector2d.');
    }

    static sum (v1, v2) {
        if (!(v1 instanceof Vector2d) || !(v2 instanceof Vector2d)) {
            throw new TypeError("Both v1 and v2 must be instances of Vector2d.");
        }

        let result = Matrix.sum(v1._vector2d, v2._vector2d);

        return new Vector2d (result);
    }

    static isVector2d (obj) {
        return obj instanceof Vector2d;
    }

    static [Symbol.hasInstance](obj) {
        if (obj !== undefined && obj._vector2d) {
            return true;
        }
        return false;
    }
}

let physics2d = {
    /**
     * Accelerate a particle for t seconds.
     * @param {number|Vector2d} initialVelocity 
     * @param {number|Vector2d} acceleration 
     * @param {number} t 
     */
    accelerate(initialVelocity, acceleration, t = 1) {
        let v0 = Vector2d.parse(initialVelocity);
        let a = Vector2d.parse(acceleration);

        if (v0 === undefined) {
            throw new TypeError("initialVelocity expected Vector2d or number");
        }
        if (a === undefined) {
            throw new TypeError("acceleration expected Vector2d or number");
        }
        
        let time = parseFloat(t);
        if (isNaN(time)) {
            throw new TypeError("t expected number");
        }
        
        a.scalarMultiplication(time);
        let v = Vector2d.sum(v0, a);

        return v;
    },

    position(initialPosition, velocity, t = 1) {
        return null;
    }
};

export {
    Vector2d, 
    Matrix,
    degrees,
    radians,
    physics2d
};
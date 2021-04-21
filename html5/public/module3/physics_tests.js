import { Vector2d, Matrix, radians, degrees, physics2d } from './physics.js';

QUnit.module('Angle convertion functions tests', function () {
    QUnit.module('radians', function () {
        QUnit.test('should convert from degrees to radians', function (assert) {
            const doTest = (input, expected) => {
                let result = radians(input);
                assert.strictEqual(result, expected);
            };

            doTest(0, 0);
            doTest(1, Math.PI / 180);
            doTest(360, 2 * Math.PI);
            doTest(90, Math.PI / 2);
            doTest(180, Math.PI);
        });
    });

    QUnit.module('degrees', function () {
        QUnit.test('should convert from radians to degrees', function (assert) {
            let doTest = (input, expected) => {
                let result = degrees(input);
                assert.strictEqual(result, expected);
            };

            doTest(0, 0);
            doTest(Math.PI / 2, 90);
            doTest(Math.PI, 180);
            doTest(3 * Math.PI, 540);
        });
    });
});

QUnit.module ('Matrix tests', function () {
    QUnit.module ('getAt (row, column)', function () {
        let array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
        let m1 = new Matrix(array);

        QUnit.test ('should return the value at position row, column in the matrix', function (assert) {
            for (var i = 0; i < array.length; i++) {
                for (var j = 0; j < array[i].length; j++) {
                    assert.strictEqual(m1.getAt(i, j), array[i][j]);
                }
            }
        });

        QUnit.test ('should throw Error when the parameters are out of range', function (assert) {
            assert.throws(() => m1.getAt(-1, 0));
        });
    });

    QUnit.module ('static vector2d (i, j)', function () {
        QUnit.test ('should return a matrix of 2x1 (2 rows by 1 column) with the values provided.', function (assert) {
            let i = 1, j = -3;
            let vector2d = Matrix.vector2d(i, j);

            assert.true(vector2d instanceof Matrix);
            assert.strictEqual(vector2d._innerArray.length, 2);
            assert.strictEqual(vector2d._innerArray[0].length, 1);
            assert.strictEqual(vector2d._innerArray[1].length, 1);
            assert.strictEqual(vector2d._innerArray[0][0], i);
            assert.strictEqual(vector2d._innerArray[1][0], j);
        });

        QUnit.test('should throw TypeError when either parameters i and/or j are not numbers.', function (assert) {
            const expectedError = new TypeError('Both i and j are expected to be numbers.');
            const doTest = (i, j) => {
                assert.throws(() => Matrix.vector2d(i, j), expectedError);
            };

            doTest(undefined, 1);
            doTest(1, undefined);
            doTest(undefined, undefined);
            doTest([[1],1], 1);
            doTest(1, [[1],2]);
            doTest([[1], 1], [[1],2]);
            doTest("99 88", 1);
            doTest(1, "99 88");
            doTest("99 88", "99 88");
        });
    });

    QUnit.module ('static empty(n,m)', function () {
        QUnit.test('should return an empty matrix size n x m with all zeroes.', function (assert) {
            let sizeN = 3;
            let sizeM = 3;
            let m = Matrix.empty(sizeN, sizeM);
            
            assert.true(m instanceof Matrix);
            for (var i = 0; i < sizeN; i++) {
                for (var j = 0; j < sizeM; j++) {
                    assert.strictEqual(m._innerArray[i][j], 0);
                }
            }
        });

        QUnit.test('should throw RangeError when either n or m are out of range.', function (assert) {
            const expectedError = new RangeError('Both n and m must be positive integers greater or equal than 1.');
            const doTest = (n, m) => {
                assert.throws(() => Matrix.empty(n, m), expectedError);
            };

            doTest(0, 1);
            doTest(1, 0);
            doTest(0, 0);
            doTest(-2, -3);
            doTest(1.2, 1);
            doTest(1, 1.2);
            doTest(-Infinity, Infinity);
        });
    });

    QUnit.module ('static identity(n)', function () {
        QUnit.test ('should return the identity matrix size n x m with all zeroes expect ones on the main diagonal.', function (assert) {
            let sizeN = 3;
            let sizeM = 3;
            let m = Matrix.identity(sizeN, sizeM);
            
            assert.true(m instanceof Matrix);
            for (var i = 0; i < sizeN; i++) {
                for (var j = 0; j < sizeM; j++) {
                    if (i == j) {
                        assert.strictEqual(m._innerArray[i][j], 1);
                    } else {
                        assert.strictEqual(m._innerArray[i][j], 0);
                    }
                }
            }
        });
        
        QUnit.test('should throw RangeError when n is out of range.', function (assert) {
            const expectedError = new RangeError('Parameter n must be positive integer greater or equal than 1.');
            const doTest = (n) => {
                assert.throws(() => Matrix.identity(n), expectedError);
            };

            doTest(0);
            doTest(-2);
            doTest(1.2);
            doTest(Infinity);
        });
    });

    QUnit.module ('static sum (m1, m2)', function () {
        QUnit.test ('should not sum two matrices with different dimensions', function (assert) {
            const doTest = (a1, a2) => {
                let m1 = new Matrix(a1);
                let m2 = new Matrix(a2);

                assert.throws (() => Matrix.sum(m1, m2), new Error('Matrices are not of the same size.'));
            };
            
            doTest([[1]], [[1],[2]]);
            doTest([[1],[2]], [[1]]);
        });

        QUnit.test ('should sum two matrices.', function (assert) {
            const doTest = (a1, a2, expected) => {
                let m1 = new Matrix(a1);
                let m2 = new Matrix(a2);
                let result = Matrix.sum(m1, m2);
                
                assert.true(result instanceof Matrix);

                let resultDimensions = result.dimensions;
                for (var i = 0; i < resultDimensions.rows; i++) {
                    for (var j = 0; j < resultDimensions.columns; j++) {
                        assert.strictEqual(result.getAt(i, j), expected[i][j]);
                    }
                }
            };

            doTest([[1], [2]], [[2], [3]], [[3], [5]]);
            doTest([[-1], [2]], [[-2], [3]], [[-3], [5]]);
            doTest([[1, 2], [2, 3]], [[-2, 3], [3, 4]], [[-1, 5], [5, 7]]);
            doTest([[4, 5, 6], [2, 3, 4]], [[1, 2, 3], [7, 9, 8]], [[5, 7, 9], [9, 12, 12]]);
        });
    });
    
    QUnit.module ('static substract (m1, m2)', function () {
        QUnit.test ('should not substract two matrices with different dimensions', function (assert) {
            const doTest = (a1, a2) => {
                let m1 = new Matrix(a1);
                let m2 = new Matrix(a2);

                assert.throws (() => Matrix.substract(m1, m2), new Error('Matrices are not of the same size.'));
            };
            
            doTest([[1]], [[1],[2]]);
            doTest([[1],[2]], [[1]]);
        });
        
        QUnit.test ('should substract two matrices.', function (assert) {
            const doTest = (a1, a2, expected) => {
                let m1 = new Matrix(a1);
                let m2 = new Matrix(a2);
                let result = Matrix.substract(m1, m2);
                
                assert.true(result instanceof Matrix);
                
                let resultDimensions = result.dimensions;
                for (var i = 0; i < resultDimensions.rows; i++) {
                    for (var j = 0; j < resultDimensions.columns; j++) {
                        assert.strictEqual(result.getAt(i, j), expected[i][j]);
                    }
                }
            };
            
            doTest([[1], [2]], [[2], [3]], [[-1], [-1]]);
            doTest([[-1], [2]], [[-2], [3]], [[1], [-1]]);
            doTest([[1, 2], [2, 3]], [[-2, 3], [3, 4]], [[3, -1], [-1, -1]]);
            doTest([[4, 5, 6], [2, 3, 4]], [[1, 2, 3], [7, 9, 8]], [[3, 3, 3], [-5, -6, -4]]);
        });
    });
});

QUnit.module('Vector tests', function () {
    QUnit.module ('constructor', function () {
        QUnit.test('should create instance from a Matrix', function (assert) {
            let matrixVector = Matrix.vector2d(1, 2);
            let v1 = new Vector2d(matrixVector);

            assert.ok(v1, "Vector2d was not created.");
        });

        QUnit.test('should accept only an instance of Matrix', function (assert) {
            assert.throws(() => new Vector2d([1, 2, 3]), new TypeError("Expect Matrix instance."));
        });
    });
    
    QUnit.module('get magnitude()', function () {
        QUnit.test('should return the magnitude of a vector', function (assert) {
            const doTest = (i, j, expectedValue) => {
                let v1 = Vector2d.fromComponents(i, j);
                let v1Magnitude = v1.magnitude;

                assert.strictEqual(v1Magnitude, expectedValue);
            };
            
            doTest(1, 1, Math.SQRT2);
            doTest(-1, -1, Math.SQRT2);
            doTest(5, 0, 5);
            doTest(0, 5, 5);
        });
    });

    QUnit.module('static from(magnitude, angle = 0)', function () {
        QUnit.test('should return a new vector with i and j values set to the proper values.', function (assert) {
            const doTest = (magnitude, angle) => {
                const expectedX = magnitude * Math.cos(radians(angle));
                const expectedY = magnitude * Math.sin(radians(angle));
    
                let v1 = Vector2d.from(magnitude, angle);
    
                assert.strictEqual(v1.i, expectedX);
                assert.strictEqual(v1.j, expectedY);
            };

            doTest(10, 0);
            doTest(10, 45);
            doTest(10, -45);
            doTest(10, 360);
            doTest(10, 180);
            doTest(10, 270);
            doTest(-10, 45);
        });

        QUnit.test('should throw TypeError when either magnitude or angle are not a number.', function (assert) {
            const expectedError = new TypeError('Both magniture and angle are expected number');
            const doTest = (magnitude, angle) => {
                assert.throws(() => Vector2d.from(magnitude, angle), expectedError);
            };

            doTest(" 12 x");
            doTest(10, " 12 x");
        });
    });

    // QUnit.module('static parse');

    QUnit.module('static sum(v1, v2)', function () {
        QUnit.test('should return a new vector which is the sum of the previous two vectors.', function (assert) {
            let v1 = Vector2d.fromComponents (1, 3);
            let v2 = Vector2d.fromComponents (3, 5);

            let vr = Vector2d.sum(v1, v2);

            assert.strictEqual (4, vr.i);
            assert.strictEqual (8, vr.j);
        });

        QUnit.test('should accept only two intances of Vector2d', function (assert) {
            const expectedError = new TypeError("Both v1 and v2 must be instances of Vector2d.");
            assert.throws(() => {
                Vector2d.sum([1], Vector2d.fromComponents(1, 2));
            }, expectedError);
            assert.throws(() => {
                Vector2d.sum(Vector2d.fromComponents(1, 2), [1]);
            }, expectedError);
        });
    });
});

QUnit.module('physics2d tests', function () {
    QUnit.module('accelerate(velocity, acceleration, t) tests', function () {
        QUnit.test('should return a new velocity vector with the result.', function (assert) {
            const doConstantTest = (initialVelocity, acceleration, time, expectedVelocity) => {
                let actualVelocity = physics2d.accelerate(initialVelocity, acceleration, time);

                assert.propEqual(actualVelocity, expectedVelocity);
            };

            const doVectorTest = (vix, viy, ax, ay, time, evx, evy) => {
                let vi = Vector2d.fromComponents(vix, viy);
                let a = Vector2d.fromComponents(ax, ay);
                let expectedVelocity = Vector2d.fromComponents(evx, evy);

                let actualVelocity = physics2d.accelerate(vi, a, time);

                assert.propEqual(actualVelocity, expectedVelocity);
            };

            doConstantTest(0, 2, 1, Vector2d.from(2));
            doVectorTest(37.58, 13.68, 0, -9.81, 0, 37.58, 13.68);
            doVectorTest(37.58, 13.68, 0, -9.81, 1, 37.58, 3.87);
            doVectorTest(37.58, 13.68, 0, -9.81, 10, 37.58, -84.42);
            doVectorTest(5, 10, 3, 3, 1, 8, 13);
        });

        QUnit.test('should throw error if velocity parameter is not a Vector2d or number.', function (assert) {
            const expectedError = new TypeError("initialVelocity expected Vector2d or number");

            assert.ok(physics2d.accelerate(0, 2, 1));
            assert.ok(physics2d.accelerate(Vector2d.fromComponents(1, 1), 2, 1));
            assert.throws(() => physics2d.accelerate('xx', 2, 1), expectedError);
            assert.throws(() => physics2d.accelerate({}, 2, 1), expectedError);
        });

        QUnit.test('should throw error if acceleration parameter is not a Vector2d or number.', function (assert) {
            const expectedError = new TypeError("acceleration expected Vector2d or number");
            
            assert.ok(physics2d.accelerate(0, 2, 1));
            assert.ok(physics2d.accelerate(Vector2d.fromComponents(1, 1), 2, 1));
            assert.throws(() => physics2d.accelerate(2, 'xx', 1), expectedError);
            assert.throws(() => physics2d.accelerate(2, {}, 1), expectedError);
        });
        
        QUnit.test('should throw error if t parameter is not a number', function (assert) {
            const expectedError = new TypeError("t expected number");

            assert.ok(physics2d.accelerate(0, 2));
            assert.ok(physics2d.accelerate(0, 2, 2));
            assert.throws(() => physics2d.accelerate(0, 2, {}), expectedError);
            assert.throws(() => physics2d.accelerate(0, 2, "zxz"), expectedError);
        });
    });

    QUnit.module('position(initialPosition, velocity, t) tests', function () {
        QUnit.test('should return a new position vector with the result.', function (assert) {
            const doConstantTest = (initialPosition, velocity, time, expectedPosition) => {
                let actualVelocity = physics2d.position(initialPosition, velocity, time);

                assert.propEqual(actualVelocity, expectedPosition);
            };

            const doVectorTest = (pix, piy, vx, vy, time, epx, epy) => {
                let initialPosition = Vector2d.fromComponents(pix, piy);
                let v = Vector2d.fromComponents(vx, vy);
                let expectedPosition = Vector2d.fromComponents(epx, epy);

                let newPosition = physics2d.position(initialPosition, v, time);

                assert.propEqual(newPosition, expectedPosition);
            };

            doConstantTest(0, 2, 1, Vector2d.from(2));
            doVectorTest(37.58, 13.68, 0, -9.81, 0, 37.58, 13.68);
            doVectorTest(37.58, 13.68, 0, -9.81, 1, 37.58, 3.87);
            doVectorTest(37.58, 13.68, 0, -9.81, 10, 37.58, -84.42);
            doVectorTest(5, 10, 3, 3, 1, 8, 13);
        });

        QUnit.test('should throw error if position parameter is not a Vector2d or number.', function (assert) {
            const expectedError = new TypeError("initialPosition expected Vector2d or number");

            assert.ok(physics2d.position(0, 2, 1));
            assert.ok(physics2d.position(Vector2d.fromComponents(1, 1), 2, 1));
            assert.throws(() => physics2d.position('xx', 2, 1), expectedError);
            assert.throws(() => physics2d.position({}, 2, 1), expectedError);
        });

        QUnit.test('should throw error if acceleration parameter is not a Vector2d or number.', function (assert) {
            const expectedError = new TypeError("acceleration expected Vector2d or number");
            
            assert.ok(physics2d.accelerate(0, 2, 1));
            assert.ok(physics2d.accelerate(Vector2d.fromComponents(1, 1), 2, 1));
            assert.throws(() => physics2d.accelerate(2, 'xx', 1), expectedError);
            assert.throws(() => physics2d.accelerate(2, {}, 1), expectedError);
        });
        
        QUnit.test('should throw error if t parameter is not a number', function (assert) {
            const expectedError = new TypeError("t expected number");

            assert.ok(physics2d.accelerate(0, 2));
            assert.ok(physics2d.accelerate(0, 2, 2));
            assert.throws(() => physics2d.accelerate(0, 2, {}), expectedError);
            assert.throws(() => physics2d.accelerate(0, 2, "zxz"), expectedError);
        });
    });
});
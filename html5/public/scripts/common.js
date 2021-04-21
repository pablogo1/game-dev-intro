let common = (function () {
    const degrees = Math.PI / 180;

    return {
        toRadians: function (deg) {
            return deg * degrees;
        }
    };
})();
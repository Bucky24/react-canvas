export function radToDeg(r) {
    return r * 180 / Math.PI;
}

export function degToRad(d) {
    return d * Math.PI / 180;
}

export function vectorMultiply(v, m) {
    var dst = [];
    for (var i = 0; i < 4; ++i) {
        dst[i] = 0.0;
        for (var j = 0; j < 4; ++j) {
            dst[i] += v[j] * m[j * 4 + i];
        }
    }
    return dst;
}
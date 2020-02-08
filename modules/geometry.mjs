export function x(vec) {
    return vec[0];
}

export function y(vec) {
    return vec[1];
}

export function vec2(x, y) {
    return [x, y];
}

export function add(vector1, vector2) {
    return [vector1[0] + vector2[0], vector1[1] + vector2[1]];
}

export function subtract(vector1, vector2) {
    return [vector1[0] - vector2[0], vector1[1] - vector2[1]];
}

export function scale(vector, scalar) {
    return [vector[0] * scalar, vector[1] * scalar];
}

// only for 2d
export function dot(vector1, vector2) {
    return vector1[0] * vector2[0] + vector1[1] * vector2[1];
}

// only for 2d
export function magnitude(vector) {
    return dot(vector, vector)**0.5;
}

export function normalize(vector) {
    return scale(vector, 1 / magnitude(vector));
}

export function project(vector, targetVector) {
    const n = normalize(targetVector);
    return scale(targetVector, dot(targetVector, vector));
}

export function perp(vector, flip = false) {
    return !flip? [vector[1], -vector[0]] : [-vector[1], vector[0]];
}
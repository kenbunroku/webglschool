precision mediump float;

varying vec4 vColor;
varying float vDistance;

void main() {
    float s = abs(vDistance);
    gl_FragColor = vec4(0.4 + 0.5*s, 0.5, 1.0 - 0.3*s, 1.0);
}

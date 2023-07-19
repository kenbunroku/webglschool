precision mediump float;

uniform float time;

varying vec4 vColor;
varying float vDistance;

void main() {
    float s = abs(vDistance);
    float ts = sin(time * 2.0);
    float tc = cos(time * 2.0);
    gl_FragColor = vec4(0.5 + 0.5*s*tc, 0.5 + 0.2*ts, 1.0 - 0.2*s*ts, 1.0);
}

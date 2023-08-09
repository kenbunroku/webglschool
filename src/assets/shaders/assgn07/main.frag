precision mediump float;

uniform sampler2D textureUnit;

varying vec4 vColor;
varying vec2 vTexCoord;

void main() {
    gl_FragColor = vColor * texture2D(textureUnit, vTexCoord);
}

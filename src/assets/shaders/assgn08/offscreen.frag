precision mediump float;

uniform sampler2D textureUnit;
varying vec2 vTexCoord;

void main() {
    vec2 coord = vTexCoord * 2.0 - 0.5;

    vec4 samplerColor = texture2D(textureUnit, coord);

    gl_FragColor = samplerColor;
}

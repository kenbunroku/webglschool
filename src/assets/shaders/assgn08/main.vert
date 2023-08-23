attribute vec3 position;
attribute vec3 normal;
attribute vec2 texCoord;
attribute vec4 color;

uniform mat4 mMatrix;
uniform mat4 mvpMatrix;

varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec4 vColor;

void main() {
    vNormal = normal;

    vTexCoord = texCoord;

    vColor = color;

    gl_Position = mvpMatrix * vec4(position, 1.0);
}

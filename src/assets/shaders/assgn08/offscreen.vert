attribute vec3 position;
attribute vec3 normal;
attribute vec2 texCoord;
uniform mat4 mvpMatrix;
uniform mat4 normalMatrix;
varying vec3 vNormal;
varying vec2 vTexCoord;

void main() {
    vNormal = normalize((normalMatrix * vec4(normal, 0.0)).xyz);

    vTexCoord = texCoord;

    gl_Position = mvpMatrix * vec4(position, 1.0);
}

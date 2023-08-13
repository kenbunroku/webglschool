attribute vec3 position;
attribute vec3 normal;
attribute vec2 texCoord;
uniform mat4 mvpMatrix;
varying vec2 vTexCoord;
varying vec3 vNormal;

const vec3 light = vec3(0.0, 0.0, 1.0);

void main() {
    vNormal = normal;

    vTexCoord = texCoord;

    gl_Position = mvpMatrix * vec4(position, 1.0);
}

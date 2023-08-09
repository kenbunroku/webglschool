attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
attribute vec2 texCoord;
uniform mat4 mvpMatrix;
uniform mat4 normalMatrix;
varying vec4 vColor;
varying vec2 vTexCoord;

const vec3 light = vec3(0.0, 0.0, 1.0);

void main() {
    vec3 n = (normalMatrix * vec4(normal, 0.0)).xyz;

    float d = dot(normalize(n), normalize(light));

    d = d * 0.5 + 0.5;

    vColor = vec4(color.rgb * d, color.a);

    vTexCoord = texCoord;

    gl_Position = mvpMatrix * vec4(position, 1.0);
}

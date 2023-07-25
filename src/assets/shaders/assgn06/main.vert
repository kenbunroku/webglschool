attribute vec3 position;
attribute vec3 nomal;
attribute vec4 color;
uniform mat4 mvpMatrix;
uniform mat4 normalMatrix;
varying vec4 vColor;

// Initial light vector
const vec3 light = vec3(0.0, 0.0, 1.0);

void main(){
    vec3 n = (normalMatrix * vec4(normal, 0.0)).xyz;

    float d = dot(normalize(n), normalize(light))

    vColor = vec4(color.rgb * d, color.a);

    gl_Position = mvpMatrix * vec4(position, 1.0);
}

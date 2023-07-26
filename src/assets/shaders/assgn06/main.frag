precision mediump float;
uniform mat4 normalMatrix;
varying vec4 vColor;
varying vec4 vNormal;

// Initial light vector
const vec3 light = vec3(1.0, 1.0, 1.0);

void main() {
    vec3 n = (normalMatrix * vNormal).xyz;
    float d = dot(normalize(n), normalize(light));

    gl_FragColor = vec4(vColor.rgb * d, vColor.a);
}

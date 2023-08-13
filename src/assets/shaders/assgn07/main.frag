precision mediump float;

uniform sampler2D textureUnit;
uniform mat4 normalMatrix;
varying vec3 vNormal;
varying vec2 vTexCoord;

const vec3 light = vec3(1.0, 2.0, 2.0);

void main() {
    vec3 n = (normalMatrix * vec4(vNormal, 0.0)).xyz;
    vec4 diffuseColor = texture2D(textureUnit, vTexCoord);

    float d = dot(normalize(n), normalize(light)) * 0.5;

    gl_FragColor = vec4(diffuseColor.rgb * d, diffuseColor.a);
}

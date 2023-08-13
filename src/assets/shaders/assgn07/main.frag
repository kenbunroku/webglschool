precision mediump float;

uniform sampler2D textureUnit;
uniform sampler2D textureUnit2;
uniform mat4 normalMatrix;
uniform float time;
uniform float progress;
varying vec3 vNormal;
varying vec2 vTexCoord;

const vec3 light = vec3(1.0, 2.0, 2.0);
vec2 mirrored(vec2 v) {
    vec2 m = mod(v, 2.0);
    return mix(m, 2.0 - m, step(1.0, m));
}

void main() {
    vec3 n = (normalMatrix * vec4(vNormal, 0.0)).xyz;

    vec2 newUV = (vTexCoord - vec2(0.5)) + vec2(0.5);
    vec4 noise = texture2D(textureUnit, mirrored(newUV + time * 0.04));
    float prog = progress * 0.8 - 0.05 + noise.g * 0.06;
    float intpl = pow(abs(smoothstep(0.0, 1.0, (prog * 2.0 - vTexCoord.y + 0.5))), 10.0);

    float d = dot(normalize(n), normalize(light)) * 0.7;

    vec4 t1 = texture2D(textureUnit, (newUV - 0.5) * (1.0 - intpl) + 0.5);
    vec4 t2 = texture2D(textureUnit2, (newUV - 0.5) * intpl + 0.5);

    gl_FragColor = mix(t1, t2, intpl) * vec4(vec3(d), 1.0);
}

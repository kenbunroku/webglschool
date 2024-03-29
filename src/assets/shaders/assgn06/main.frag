precision mediump float;

uniform float intensity;
uniform float isDirectionalLight;
uniform vec3 directionalLightColor;
uniform vec3 pointLightPosition1;
uniform vec3 pointLightColor1;
uniform vec3 spotLightPosition;
uniform vec3 spotLightTarget;
uniform vec3 spotLightColor;
uniform float innerLimit;
uniform float outerLimit;
uniform mat4 normalMatrix;

varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vPosition;

// Directional light vector
const vec3 light = vec3(1.0, 1.0, 1.0);

void main() {
    vec3 n = (normalMatrix * vec4(vNormal, 0.0)).xyz;
    float d = dot(normalize(n), normalize(light));

    vec3 pointLightDirection = pointLightPosition1 - vPosition;
    float pd = clamp(dot(normalize(n), normalize(pointLightDirection)), 0.0, 1.0);

    vec3 spotLightDirection = spotLightPosition - vPosition;
    vec3 spotDirection = spotLightTarget - spotLightPosition;
    float spotEffect = dot(normalize(spotLightDirection), normalize(-spotDirection));
    float inLight = smoothstep(outerLimit, innerLimit, spotEffect);
    float sd = inLight * clamp(dot(normalize(n), normalize(spotLightDirection)), 0.0, 1.0);

    vec3 ambient = isDirectionalLight * vec3(0.1, 0.1, 0.1);

    vec3 combinedLight = d * directionalLightColor * intensity + pd * pointLightColor1 + sd * spotLightColor + ambient;

    gl_FragColor = vec4(vColor.rgb * combinedLight, vColor.a);
}

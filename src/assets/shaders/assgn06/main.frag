precision mediump float;

uniform float intensity;
uniform vec3 pointLightPosition1;
uniform vec3 pointLightPosition2;
uniform vec3 spotLightPosition;
uniform vec3 spotLightTarget;
uniform vec3 directionalLightColor;
uniform vec3 pointLightColor1;
uniform vec3 pointLightColor2;
uniform mat4 normalMatrix;

varying vec4 vColor;
varying vec4 vNormal;
varying vec3 vPosition;

// Directional light vector
const vec3 light = vec3(1.0, 1.0, 1.0);

void main() {
vec3 n = (normalMatrix * vNormal).xyz;
float d = dot(normalize(n), normalize(light));

vec3 pointLightDirection = pointLightPosition1 - vPosition;
float d2 = clamp(dot(normalize(n), normalize(pointLightDirection)), 0.0, 1.0);

vec3 pointLightDirection2 = pointLightPosition2 - vPosition;

float d3 = clamp(dot(normalize(n), normalize(pointLightDirection2)), 0.0, 1.0);

vec3 spotLightDirection = spotLightPosition - vPosition;
vec3 spotDirection = spotLightTarget - spotLightPosition;
float spotEffect = dot(normalize(spotLightDirection), normalize(- spotDirection));
float d5 = 0.0;
if(spotEffect >= .93) {
d5 = clamp(dot(normalize(n), normalize(spotLightDirection)), 0.0, 1.0);
}

vec3 ambient = vec3(0.1, 0.1, 0.1);

vec3 combinedLight = d * directionalLightColor * intensity + d2 * pointLightColor1 + d5 * pointLightColor2 + ambient;

gl_FragColor = vec4(vColor.rgb * combinedLight, vColor.a);
}

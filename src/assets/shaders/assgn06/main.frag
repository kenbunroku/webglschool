precision mediump float;
uniform vec3 lightPosition;
uniform vec3 lightPosition2;
uniform vec3 lightColor;
uniform vec3 lightColor2;
uniform vec3 lightColor3;
uniform mat4 normalMatrix;
varying vec4 vColor;
varying vec4 vNormal;
varying vec3 vPosition;

// Directional light vector
const vec3 light = vec3(1.0, 1.0, 1.0);

void main() {
    vec3 n = (normalMatrix * vNormal).xyz;
    float d = clamp(dot(normalize(n), normalize(light)), 0.1, 1.0);

    vec3 pointLightDirection = lightPosition - vPosition;
    float d2 = clamp(dot(normalize(n), normalize(pointLightDirection)), 0.0, 1.0);


    vec3 pointLightDirection2 = lightPosition2 - vPosition;
    float d3 = clamp(dot(normalize(n), normalize(pointLightDirection2)), 0.0, 1.0);

    vec3 combinedLight = d * lightColor * 0.5 + d2 * lightColor2 + d3 * lightColor3;

    gl_FragColor = vec4(vColor.rgb * combinedLight, vColor.a);
}

precision mediump float;

uniform sampler2D textureUnit;
uniform float mouseX;
uniform float mouseY;
uniform int type;
varying vec2 vTexCoord;

float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
  uv -= disc_center;
  uv *= vec2(1., -1.);
  float dist = sqrt(dot(uv, uv));
  return smoothstep(disc_radius + border_size, disc_radius - border_size, dist);
}

float hash12(vec2 p) {
  float h = dot(p, vec2(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}

void main() {
  vec2 newTexCoord = vTexCoord;
  vec2 mouse = vec2(mouseX, mouseY);
  vec4 samplerColor = vec4(1.0, 1.0, 1.0, 1.0);
  float velo = 0.05;

  // color distortion effect
  if(type == 0) {
    velo = 0.2;
    float c = circle(newTexCoord, mouse, 0.0, 0.2);

    float r = texture2D(textureUnit, newTexCoord += c * (velo * 0.5)).x;
    float g = texture2D(textureUnit, newTexCoord += c * (-velo * 0.725)).y;
    float b = texture2D(textureUnit, newTexCoord += c * (velo * 0.55)).z;

    samplerColor = vec4(r, g, b, 1.0);
  }

  // zoom effect
  if(type == 1) {
    velo = 0.03;
    float c = circle(newTexCoord, mouse, 0.0, 0.1 + velo * 2.0) * 40.0 * velo;
    vec2 warpedTexCoord = mix(newTexCoord, mouse, c * 0.99);
    samplerColor = texture2D(textureUnit, warpedTexCoord) + texture2D(textureUnit, warpedTexCoord) * vec4(vec3(c), 1.0);
  }

  // random effect
  if(type == 2) {
    velo = 0.01;
    float hash = hash12(newTexCoord * 10.0);
    float c = circle(newTexCoord, mouse, 0.0, 0.2 + velo * 0.01) * 10.0 * velo;
    vec2 warpedTexCoord = newTexCoord + vec2(hash - 0.5) * c;
    samplerColor = texture2D(textureUnit, warpedTexCoord) + texture2D(textureUnit, warpedTexCoord) * vec4(vec3(c), 1.0);
  }

  gl_FragColor = samplerColor;
}

precision mediump float;

uniform sampler2D textureUnit;
uniform float mouseX;
uniform float mouseY;
uniform float mouseDx;
uniform float mouseDy;
varying vec2 vTexCoord;

float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
  uv -= disc_center;
  uv *= vec2(1., -1.);
  float dist = sqrt(dot(uv, uv));
  return smoothstep(disc_radius + border_size, disc_radius - border_size, dist);
}

void main() {
  float d = sqrt(mouseDx * mouseDx);
  vec2 newTexCoord = vTexCoord;

  float c = circle(newTexCoord, vec2(mouseX, mouseY), 0.0, 0.2);

  float r = texture2D(textureUnit, newTexCoord += c * (0.1 * 0.5 + d)).x;
  float g = texture2D(textureUnit, newTexCoord += c * (0.1 * 0.525 + d)).y;
  float b = texture2D(textureUnit, newTexCoord += c * (0.1 * 0.55 + d)).z;

  vec4 samplerColor = vec4(r, g, b, 1.0);

  gl_FragColor = samplerColor;
}

precision mediump float;

uniform sampler2D textureUnit;
uniform float mouseX;
uniform float mouseY;
uniform int type;
uniform float time;
uniform float aspect;
varying vec2 vTexCoord;

float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size, float aspect) {
  uv.x *= aspect;
  disc_center.x *= aspect;
  uv -= disc_center;
  uv *= vec2(1., -1.);
  float dist = sqrt(dot(uv, uv));
  return smoothstep(disc_radius + border_size, disc_radius - border_size, dist);
}

float hash12(vec2 p) {
  float h = dot(p, vec2(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}

float hash12_time(vec2 p, float t) {
  float h = dot(p, vec2(127.1, 311.7 + t));
  return fract(sin(h) * 43758.5453123);
}

void main() {
  vec2 newTexCoord = vTexCoord;
  vec2 mouse = vec2(mouseX, mouseY);
  vec4 samplerColor = vec4(1.0, 1.0, 1.0, 1.0);
  float velo = 0.05;

  // color distortion effect
  if(type == 0) {
    velo = 0.2 + 0.05 * sin(time);
    float c = circle(newTexCoord, mouse, 0.0, 0.2, aspect);

    float r = texture2D(textureUnit, newTexCoord += c * (velo * 0.5)).x;
    float g = texture2D(textureUnit, newTexCoord += c * (-velo * 1.725)).y;
    float b = texture2D(textureUnit, newTexCoord += c * (velo * 0.55)).z;

    samplerColor = vec4(r, g, b, 1.0);
  }

  // zoom effect
  if(type == 1) {
    velo = 0.03 + sin(time) * 0.03;
    float c = circle(newTexCoord, mouse, 0.0, 0.1 + velo * 2.0, aspect) * 40.0 * velo;

  // Rotate while zooming
    float angle = c * 3.14 * cos(time); // rotation angle based on c
    mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 rotatedCoord = rotation * (newTexCoord - mouse) + mouse;

    vec2 warpedTexCoord = mix(rotatedCoord, mouse, c * 0.99);

  // Color Variation
    vec4 originalColor = texture2D(textureUnit, warpedTexCoord);
    vec4 colorShift = vec4(vec3(1.0 - c, 1.0, 1.0 - c), 1.0); // example color shift

    samplerColor = originalColor * colorShift + originalColor * vec4(vec3(c), 1.0);
  }

  // random effect
  if(type == 2) {
    velo = 0.01 + 0.01 * sin(time); // Animated velo

  // Original warping
    float hash = hash12(newTexCoord * 10.0);
    float c = circle(newTexCoord, mouse, 0.0, 0.2 + velo * 0.01, aspect) * 10.0 * velo;

  // Additional layer of warping
    float hash_time = hash12_time(newTexCoord * 5.0, time);
    float c_time = circle(newTexCoord, mouse, 0.0, 0.2 + velo * 0.005, aspect) * 5.0 * velo;

    vec2 warpedTexCoord = newTexCoord + vec2(hash - 0.5) * c + vec2(hash_time - 0.5) * c_time;

  // Color variation
    vec4 originalColor = texture2D(textureUnit, warpedTexCoord);
    vec4 colorShift = vec4(vec3(c_time, 0.0, 0.0), 1.0);

    samplerColor = originalColor + originalColor * colorShift;
  }

  gl_FragColor = samplerColor;
}

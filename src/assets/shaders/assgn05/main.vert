precision mediump float;
attribute vec3 position;
attribute vec4 color;
varying vec4 vColor;
varying float vDistance;

uniform float time;
uniform float numOfQuads;

void main() {
  vColor = color;

  // angle of position
  float angle = atan(position.y, position.x);

  // distance of position
  float distance = length(position.xy) - numOfQuads / 100.0;

  // new angle
  angle += cos(time) * distance * 0.5;

  // new position
  vec2 newPosition = vec2(cos(angle), sin(angle)) * distance * 0.8;

  gl_Position = vec4(newPosition, position.z, 1.0);

  vDistance = distance;
}


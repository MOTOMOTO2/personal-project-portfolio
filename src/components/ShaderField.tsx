import { useEffect, useRef } from 'react'

/**
 * The hero's background: a field of topographic contour lines drawn by a
 * fragment shader, slowly drifting, with a lens that follows the pointer (or,
 * with no pointer, a glow that orbits on its own). Raw WebGL2, no library.
 *
 * - Colours come from the theme's CSS variables, so it follows dark/light.
 * - It pauses when off screen or in a background tab.
 * - It drops its resolution if frames get slow.
 * - With reduced motion it draws one still frame.
 * - Without WebGL2 it draws nothing and the CSS glow behind it shows.
 */

const VERTEX = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_hover;
uniform vec3 u_bg;
uniform vec3 u_line;
uniform vec3 u_accent;
out vec4 color;

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash(i), f), dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 turn = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = turn * p * 2.03;
    amplitude *= 0.5;
  }
  return value;
}

// An anti-aliased line wherever x crosses a whole number.
float iso(float x, float width) {
  float w = fwidth(x) * width;
  return 1.0 - smoothstep(0.0, w, abs(fract(x - 0.5) - 0.5));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  vec2 m = (u_mouse - 0.5 * u_res) / u_res.y;
  float t = u_time * 0.035;

  // Domain-warped height field, nudged up under the pointer like a lens.
  vec2 q = vec2(fbm(uv * 1.2 + vec2(t, -t)), fbm(uv * 1.2 + vec2(-0.7 * t, t) + 4.3));
  float d = length(uv - m);
  float lens = exp(-d * d * 9.0) * u_hover;
  float h = fbm(uv * 1.5 + q * 1.35) + lens * 0.22;

  float minor = iso(h * 16.0, 1.3);
  float major = iso(h * 4.0, 1.7);

  // Quieter towards the left and bottom, where the text sits.
  float fade = smoothstep(1.45, 0.05, length((uv - vec2(0.35, 0.18)) * vec2(0.7, 1.0)));
  float glow = exp(-d * d * 4.0) * u_hover;

  vec3 hot = mix(u_line, u_accent, clamp(glow * 1.6 + smoothstep(0.12, 0.42, h) * 0.75, 0.0, 1.0));
  vec3 c = u_bg;
  c = mix(c, u_line, minor * 0.13 * fade);
  c = mix(c, hot, major * (0.3 + 0.55 * glow) * fade);
  c += u_accent * glow * 0.05;
  color = vec4(c, 1.0);
}`

/** Reads a CSS colour variable as linear 0..1 RGB, via a probe element. */
function cssColor(name: string): [number, number, number] {
  const probe = document.createElement('span')
  probe.style.color = `var(${name})`
  probe.style.display = 'none'
  document.body.appendChild(probe)
  const value = getComputedStyle(probe).color
  probe.remove()
  const parts = value.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0]
  // "rgb(255, 90, 20)" is 0..255; "color(srgb 1 0.35 0.08)" is already 0..1.
  const scale = value.startsWith('color(') ? 1 : 255
  return [parts[0] / scale, parts[1] / scale, parts[2] / scale]
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null
}

export function ShaderField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof WebGL2RenderingContext === 'undefined') return
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) return

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX)
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
    const program = gl.createProgram()
    if (!vertex || !fragment || !program) return
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    // One triangle that covers the screen.
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const u = {
      res: uniform('u_res'),
      time: uniform('u_time'),
      mouse: uniform('u_mouse'),
      hover: uniform('u_hover'),
      bg: uniform('u_bg'),
      line: uniform('u_line'),
      accent: uniform('u_accent'),
    }

    const setColors = () => {
      gl.uniform3fv(u.bg, cssColor('--bg'))
      gl.uniform3fv(u.line, cssColor('--fg'))
      gl.uniform3fv(u.accent, cssColor('--accent'))
    }
    setColors()

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let quality = Math.min(window.devicePixelRatio || 1, 1.5)
    let scale = quality
    const resize = () => {
      scale = quality
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale))
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(u.res, canvas.width, canvas.height)
    }
    resize()

    // Pointer state, eased every frame so the lens glides rather than jumps.
    const target = { x: 0, y: 0, inside: false }
    const eased = { x: canvas.width * 0.72, y: canvas.height * 0.6, hover: 0.35 }
    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const inside =
        event.pointerType === 'mouse' &&
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      target.inside = inside
      if (inside) {
        target.x = (event.clientX - rect.left) * scale
        target.y = (rect.bottom - event.clientY) * scale
      }
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    let frame = 0
    let running = false
    let visible = true
    let last = performance.now()
    let slow = 0
    const start = performance.now() - 40_000 * Math.random()

    const draw = (now: number) => {
      const seconds = reduced ? 12 : (now - start) / 1000
      if (target.inside) {
        eased.x += (target.x - eased.x) * 0.08
        eased.y += (target.y - eased.y) * 0.08
        eased.hover += (1 - eased.hover) * 0.06
      } else {
        // No pointer: a glow drifts on a slow orbit so the field still feels alive.
        const ox = canvas.width * (0.68 + 0.16 * Math.cos(seconds * 0.11))
        const oy = canvas.height * (0.58 + 0.18 * Math.sin(seconds * 0.15))
        eased.x += (ox - eased.x) * 0.02
        eased.y += (oy - eased.y) * 0.02
        eased.hover += (0.4 - eased.hover) * 0.03
      }
      gl.uniform1f(u.time, seconds)
      gl.uniform2f(u.mouse, eased.x, eased.y)
      gl.uniform1f(u.hover, eased.hover)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const loop = (now: number) => {
      // Frames slower than ~22ms for a while: render fewer pixels.
      slow = now - last > 22 ? slow + 1 : Math.max(0, slow - 1)
      last = now
      if (slow > 45 && quality > 0.6) {
        quality = Math.max(0.6, quality * 0.75)
        slow = 0
        resize()
      }
      draw(now)
      frame = requestAnimationFrame(loop)
    }

    const play = () => {
      if (running || reduced || !visible || document.hidden) return
      running = true
      last = performance.now()
      frame = requestAnimationFrame(loop)
    }
    const pause = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting)
      if (visible) play()
      else pause()
    })
    observer.observe(canvas)
    const onVisibility = () => (document.hidden ? pause() : play())
    document.addEventListener('visibilitychange', onVisibility)

    const sizeObserver = new ResizeObserver(() => {
      resize()
      if (!running) draw(performance.now())
    })
    sizeObserver.observe(canvas)

    // The theme toggle swaps a class on <html>; pick up the new colours.
    const themeObserver = new MutationObserver(() => {
      setColors()
      if (!running) draw(performance.now())
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    draw(performance.now())
    play()

    return () => {
      pause()
      observer.disconnect()
      sizeObserver.disconnect()
      themeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className={className} />
}

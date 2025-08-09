'use client'

import * as React from 'react'

type WebGLContextResult = {
  gl: WebGLRenderingContext | WebGL2RenderingContext
  ext: {
    internalFormat: number
    internalFormatRG: number
    formatRG: number
    texType: number
  }
  support_linear_float: boolean | null
}

const config = {
  TEXTURE_DOWNSAMPLE: 1,
  DENSITY_DISSIPATION: 0.991,
  VELOCITY_DISSIPATION: 0.9992,
  PRESSURE_DISSIPATION: 0.8,
  PRESSURE_ITERATIONS: 16,
  CURL: 12,
  SPLAT_RADIUS: 0.12,
  SPEED: 0.01,
}

export default function FluidCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    let splatStack: any[] = []

    const { gl, ext, support_linear_float } = getWebGLContext(canvas)

    function getWebGLContext(canvas: HTMLCanvasElement): WebGLContextResult {
      const params = {
        alpha: false,
        depth: false,
        stencil: false,
        antialias: true,
      }

      let gl: WebGLRenderingContext | WebGL2RenderingContext | null =
        canvas.getContext('webgl2', params) as WebGL2RenderingContext | null

      const isWebGL2 = !!gl

      if (!isWebGL2) {
        gl = (canvas.getContext('webgl', params) ||
          canvas.getContext(
            'experimental-webgl',
            params
          )) as WebGLRenderingContext | null
      }

      if (!gl) throw new Error('WebGL not supported')

      const halfFloat = gl.getExtension('OES_texture_half_float')
      let support_linear_float = gl.getExtension(
        'OES_texture_half_float_linear'
      )

      if (isWebGL2) {
        gl.getExtension('EXT_color_buffer_float')
        support_linear_float = gl.getExtension('OES_texture_float_linear')
      }

      const internalFormat = isWebGL2
        ? (gl as WebGL2RenderingContext).RGBA16F
        : gl.RGBA
      const internalFormatRG = isWebGL2
        ? (gl as WebGL2RenderingContext).RG16F
        : gl.RGBA
      const formatRG = isWebGL2 ? (gl as WebGL2RenderingContext).RG : gl.RGBA
      const texType = isWebGL2
        ? (gl as WebGL2RenderingContext).HALF_FLOAT
        : halfFloat?.HALF_FLOAT_OES || gl.UNSIGNED_BYTE

      return {
        gl: gl as WebGLRenderingContext,
        ext: {
          internalFormat,
          internalFormatRG,
          formatRG,
          texType,
        },
        support_linear_float: !!support_linear_float,
      }
    }

    class GLProgram {
      program: WebGLProgram
      uniforms: { [key: string]: WebGLUniformLocation | null }

      constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this.uniforms = {}
        this.program = gl.createProgram()!

        gl.attachShader(this.program, vertexShader)
        gl.attachShader(this.program, fragmentShader)
        gl.linkProgram(this.program)

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
          throw new Error(
            gl.getProgramInfoLog(this.program) || 'Program failed to link'
          )
        }

        const uniformCount = gl.getProgramParameter(
          this.program,
          gl.ACTIVE_UNIFORMS
        )
        for (let i = 0; i < uniformCount; i++) {
          const uniformName = gl.getActiveUniform(this.program, i)!.name
          this.uniforms[uniformName] = gl.getUniformLocation(
            this.program,
            uniformName
          )
        }
      }

      bind() {
        gl.useProgram(this.program)
      }
    }

    function compileShader(type: number, source: string): WebGLShader {
      const shader = gl.createShader(type)!
      gl.shaderSource(shader, source)
      gl.compileShader(shader)

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(
          gl.getShaderInfoLog(shader) || 'Shader compilation failed'
        )
      }

      return shader
    }

    const baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `
    )

    const displayShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
        float density = texture2D(uTexture, vUv).r;
        // Darker fluid effect for better theme compatibility
        vec3 color = vec3(density * 0.15);
        gl_FragColor = vec4(color, 1.0);
      }
    `
    )

    const splatShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `
    )

    // Initialize shaders
    const displayProgram = new GLProgram(baseVertexShader, displayShader)
    const splatProgram = new GLProgram(baseVertexShader, splatShader)

    // Create framebuffers
    function createFBO(
      width: number,
      height: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ) {
      gl.activeTexture(gl.TEXTURE0)
      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        width,
        height,
        0,
        format,
        type,
        null
      )

      const fbo = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      )
      gl.viewport(0, 0, width, height)
      gl.clear(gl.COLOR_BUFFER_BIT)

      return {
        texture,
        fbo,
        width,
        height,
        attach(id: number) {
          gl.activeTexture(gl.TEXTURE0 + id)
          gl.bindTexture(gl.TEXTURE_2D, texture)
          return id
        },
      }
    }

    const blit = (() => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        gl.STATIC_DRAW
      )
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([0, 1, 2, 0, 2, 3]),
        gl.STATIC_DRAW
      )
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(0)

      return (destination: any) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, destination)
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
      }
    })()

    const simWidth = 128
    const simHeight = 128
    const dyeWidth = canvas.width
    const dyeHeight = canvas.height

    const density = createFBO(
      dyeWidth,
      dyeHeight,
      ext.internalFormat,
      gl.RGBA,
      ext.texType,
      support_linear_float ? gl.LINEAR : gl.NEAREST
    )

    function splat(
      x: number,
      y: number,
      dx: number,
      dy: number,
      color: number[]
    ) {
      if (!canvas) return
      splatProgram.bind()
      gl.uniform1i(splatProgram.uniforms.uTarget, density.attach(0))
      gl.uniform1f(
        splatProgram.uniforms.aspectRatio,
        canvas.width / canvas.height
      )
      gl.uniform2f(
        splatProgram.uniforms.point,
        x / canvas.width,
        1.0 - y / canvas.height
      )
      gl.uniform3f(splatProgram.uniforms.color, color[0], color[1], color[2])
      gl.uniform1f(splatProgram.uniforms.radius, config.SPLAT_RADIUS)
      blit(density.fbo)
    }

    function render() {
      if (!canvas) return
      gl.viewport(0, 0, canvas.width, canvas.height)
      displayProgram.bind()
      gl.uniform1i(displayProgram.uniforms.uTexture, density.attach(0))
      blit(null)
    }

    // Animation loop
    let lastTime = Date.now()
    function update() {
      const dt = Math.min((Date.now() - lastTime) / 1000, 0.016)
      lastTime = Date.now()

      // Generate automatic splats
      if (splatStack.length > 0) {
        for (let i = 0; i < splatStack.length; i++) {
          const s = splatStack[i]
          splat(s.x, s.y, s.dx, s.dy, s.color)
        }
        splatStack = []
      }

      render()
      requestAnimationFrame(update)
    }

    // Mouse interaction
    let mouseX = 0
    let mouseY = 0

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const dx = x - mouseX
      const dy = y - mouseY
      mouseX = x
      mouseY = y

      if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
        splatStack.push({
          x,
          y,
          dx: dx * 10,
          dy: dy * 10,
          color: [0.3, 0.2, 0.1],
        })
      }
    })

    // Start animation
    update()

    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      className="pointer-events-auto fixed inset-0 h-full w-full"
      ref={canvasRef}
      style={{
        mixBlendMode: 'multiply',
        opacity: 0.4,
      }}
    />
  )
}

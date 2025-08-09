'use client'

import { useEffect, useRef, useState } from 'react'

interface AudioReactivityOptions {
  fftSize?: number
  smoothingTimeConstant?: number
  dataPoints?: number
}

export function useAudioReactivity(options: AudioReactivityOptions = {}) {
  const {
    fftSize = 256,
    smoothingTimeConstant = 0.8,
    dataPoints = 64,
  } = options

  const [audioLevels, setAudioLevels] = useState<Float32Array>(
    new Float32Array(dataPoints).fill(0)
  )
  const [bassLevel, setBassLevel] = useState(0)
  const [midLevel, setMidLevel] = useState(0)
  const [trebleLevel, setTrebleLevel] = useState(0)
  const [isActive, setIsActive] = useState(false)

  const audioContextRef = useRef<AudioContext>(null as any)
  const analyserRef = useRef<AnalyserNode>(null as any)
  const dataArrayRef = useRef<Float32Array>(null as any)

  useEffect(() => {
    // Initialize audio context only in browser environment
    const initAudio = async () => {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || !window.AudioContext) {
        return
      }

      try {
        const audioContext = new (
          window.AudioContext || (window as any).webkitAudioContext
        )()
        const analyser = audioContext.createAnalyser()

        analyser.fftSize = fftSize
        analyser.smoothingTimeConstant = smoothingTimeConstant

        // Create empty data array
        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Float32Array(bufferLength)

        audioContextRef.current = audioContext
        analyserRef.current = analyser
        dataArrayRef.current = dataArray

        // Set up microphone input (audio reactive)
        try {
          if (navigator.mediaDevices) {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: true,
            })
            const source = audioContext.createMediaStreamSource(stream)
            source.connect(analyser)
            setIsActive(true)
          }
        } catch (err) {
          console.log('Microphone access denied, using system audio simulation')
          setIsActive(false)
        }
      } catch (err) {
        console.error('Audio initialization failed:', err)
        setIsActive(false)
      }
    }

    initAudio()

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [fftSize, smoothingTimeConstant])

  // Animation loop to update audio data
  useEffect(() => {
    if (!(isActive || analyserRef.current)) {
      // Simulate audio levels when inactive
      const interval = setInterval(() => {
        const simulatedData = new Float32Array(dataPoints)
        for (let i = 0; i < dataPoints; i++) {
          // Simple wave simulation
          const time = Date.now() / 1000
          const frequency = (i / dataPoints) * 5
          simulatedData[i] = (Math.sin(time * 2 + frequency) * 0.5 + 0.5) * 0.3
        }
        setAudioLevels(simulatedData)

        // Simulate frequency bands
        const currentTime = Date.now() / 1000
        setBassLevel(Math.sin(currentTime * 1.5) * 0.3 + 0.4)
        setMidLevel(Math.sin(currentTime * 2) * 0.3 + 0.4)
        setTrebleLevel(Math.sin(currentTime * 2.5) * 0.3 + 0.4)
      }, 50)

      return () => clearInterval(interval)
    }

    let animationId: number

    const updateAudioData = () => {
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getFloatFrequencyData(dataArrayRef.current)

        // Convert frequency data to amplitude (0-1)
        const normalizedData = dataArrayRef.current
          .slice(0, dataPoints)
          .map((value) => {
            const db = Math.max(value, -90) // Min decibels
            return 10 ** (db / 60) // Convert to 0-1 range
          })

        setAudioLevels(normalizedData)

        // Calculate frequency bands
        const bassEnd = Math.floor(dataPoints * 0.1)
        const midEnd = Math.floor(dataPoints * 0.4)

        const bass = normalizedData
          .slice(0, bassEnd)
          .reduce((a, b) => Math.max(a, b), 0)
        const mid = normalizedData
          .slice(bassEnd, midEnd)
          .reduce((a, b) => Math.max(a, b), 0)
        const treble = normalizedData
          .slice(midEnd)
          .reduce((a, b) => Math.max(a, b), 0)

        setBassLevel(bass)
        setMidLevel(mid)
        setTrebleLevel(treble)
      }

      animationId = requestAnimationFrame(updateAudioData)
    }

    animationId = requestAnimationFrame(updateAudioData)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [dataPoints, isActive])

  return {
    audioLevels,
    bassLevel,
    midLevel,
    trebleLevel,
    isActive,
    activate: () => {
      // Request microphone access when user interacts
      try {
        if (
          !isActive &&
          typeof navigator !== 'undefined' &&
          navigator.mediaDevices &&
          audioContextRef.current &&
          audioContextRef.current.state === 'suspended'
        ) {
          audioContextRef.current.resume()
        }
      } catch (err) {
        console.log('Audio activation failed:', err)
      }
    },
  }
}

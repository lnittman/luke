'use server'

import { generateText } from 'ai'
import { openRouter } from '@/lib/ai-providers'
import { generateMatrixRainFrames } from '@/lib/ascii-engine/generators/matrix'
import { generateWaveFrames, generateDataFlowFrames, generatePulseFrames } from '@/lib/ascii-engine/generators/wave'

export async function generateAsciiArt(prompt: string) {
  try {
    // Generate ASCII art description using AI
    const { text } = await generateText({
      model: openRouter('anthropic/claude-3.5-sonnet'),
      prompt: `You are an ASCII art expert. Based on this prompt, describe what ASCII animation to create. Be specific about:
1. Animation type (matrix, wave, data flow, pulse, dots, custom pattern)
2. Frame count (10-60 frames)
3. Dimensions (width: 40-120, height: 20-40)
4. Character set to use
5. Animation speed

Prompt: ${prompt}

Respond in JSON format:
{
  "type": "matrix|wave|dataflow|pulse|custom",
  "frameCount": number,
  "width": number,
  "height": number,
  "characters": string[],
  "description": "brief description"
}`,
      temperature: 0.7,
      maxTokens: 500,
    })

    // Parse the AI response
    const config = JSON.parse(text)
    
    // Generate frames based on type
    let frames: string[] = []
    
    switch (config.type) {
      case 'matrix':
        frames = generateMatrixRainFrames(config.width, config.height, config.frameCount)
        break
      case 'wave':
        frames = generateWaveFrames(config.width, config.height, config.frameCount)
        break
      case 'dataflow':
        frames = generateDataFlowFrames(config.width, config.height, config.frameCount)
        break
      case 'pulse':
        frames = generatePulseFrames(config.width, config.height, config.frameCount)
        break
      default:
        // For custom, generate using AI
        const { text: customFrames } = await generateText({
          model: openRouter('anthropic/claude-3.5-sonnet'),
          prompt: `Create ${config.frameCount} ASCII art animation frames.
Each frame should be ${config.width} characters wide and ${config.height} lines tall.
Use these characters: ${config.characters.join(', ')}
Description: ${config.description}

Return ONLY the frames, separated by "---FRAME---" markers.`,
          temperature: 0.8,
          maxTokens: 4000,
        })
        
        frames = customFrames.split('---FRAME---').map(f => f.trim()).filter(Boolean)
    }

    return {
      frames,
      config,
    }
  } catch (error) {
    console.error('Error generating ASCII art:', error)
    // Fallback to a simple pattern
    return {
      frames: generateMatrixRainFrames(60, 20, 30),
      config: {
        type: 'matrix',
        frameCount: 30,
        width: 60,
        height: 20,
        description: 'Matrix rain animation'
      }
    }
  }
}
'use client';

import { useState } from 'react';
import { AsciiEditor } from '@/lib/ascii-engine/editor';
import { AsciiEngine } from '@/lib/ascii-engine';
import { Presets } from '@/lib/ascii-engine/presets';
import { TextFade } from '@/components/shared/text-fade';

export default function AsciiPage() {
  const [savedAnimations, setSavedAnimations] = useState<{
    name: string;
    frames: string[];
  }[]>([]);
  const [selectedAnimation, setSelectedAnimation] = useState<string[]>([]);
  const [showPresets, setShowPresets] = useState(false);

  const handleSave = (frames: string[]) => {
    const name = prompt('Enter a name for this animation:');
    if (name) {
      setSavedAnimations(prev => [...prev, { name, frames }]);
    }
  };

  const presetList = [
    { name: 'Matrix Rain', generator: Presets.matrixRain },
    { name: 'Binary Cascade', generator: Presets.binaryCascade },
    { name: 'Wave', generator: Presets.wave },
    { name: 'Data Flow', generator: Presets.dataFlow },
    { name: 'Pulse', generator: Presets.pulse },
    { name: 'Water', generator: Presets.water },
    { name: 'Dots', generator: Presets.dots },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'rgb(var(--background-start))',
      fontFamily: 'monospace',
    }}>
      {/* Header */}
      <div style={{
        padding: '2rem',
        borderBottom: '1px solid rgb(var(--border))',
      }}>
        <TextFade style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          ASCII Engine
        </TextFade>
        <div style={{ 
          fontSize: '0.875rem', 
          color: 'rgb(var(--text-secondary))',
          marginTop: '0.5rem',
        }}>
          Create frame-based ASCII animations
        </div>
      </div>

      {/* Controls */}
      <div style={{
        padding: '1rem 2rem',
        display: 'flex',
        gap: '1rem',
        borderBottom: '1px solid rgb(var(--border))',
      }}>
        <button 
          onClick={() => setShowPresets(!showPresets)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'rgb(var(--surface-1))',
            border: '1px solid rgb(var(--border))',
            color: 'rgb(var(--text-primary))',
            cursor: 'pointer',
            fontFamily: 'monospace',
          }}
        >
          {showPresets ? 'Hide' : 'Show'} Presets
        </button>
        
        {savedAnimations.length > 0 && (
          <select
            onChange={(e) => {
              const animation = savedAnimations.find(a => a.name === e.target.value);
              if (animation) setSelectedAnimation(animation.frames);
            }}
            style={{
              padding: '0.5rem',
              backgroundColor: 'rgb(var(--surface-1))',
              border: '1px solid rgb(var(--border))',
              color: 'rgb(var(--text-primary))',
              fontFamily: 'monospace',
            }}
          >
            <option value="">Load saved animation...</option>
            {savedAnimations.map(a => (
              <option key={a.name} value={a.name}>{a.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Presets Grid */}
      {showPresets && (
        <div style={{
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          borderBottom: '1px solid rgb(var(--border))',
        }}>
          {presetList.map(preset => (
            <button
              key={preset.name}
              onClick={() => setSelectedAnimation(preset.generator())}
              style={{
                padding: '1rem',
                backgroundColor: 'rgb(var(--surface-1))',
                border: '1px solid rgb(var(--border))',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgb(var(--accent-1))';
                e.currentTarget.style.backgroundColor = 'rgb(var(--surface-2))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgb(var(--border))';
                e.currentTarget.style.backgroundColor = 'rgb(var(--surface-1))';
              }}
            >
              <div style={{
                width: '100%',
                height: '80px',
                overflow: 'hidden',
                backgroundColor: 'rgb(var(--background-start))',
                border: '1px solid rgb(var(--border))',
                padding: '0.25rem',
              }}>
                <AsciiEngine
                  frames={preset.generator().slice(0, 5)}
                  fps={4}
                  loop={true}
                  style={{
                    fontSize: '6px',
                    lineHeight: '7px',
                    opacity: 0.8,
                    color: 'rgb(var(--accent-1))',
                  }}
                />
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: 'rgb(var(--text-primary))',
                fontFamily: 'monospace',
              }}>
                {preset.name}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Editor */}
      <div style={{ padding: '2rem' }}>
        <AsciiEditor
          initialFrames={selectedAnimation.length > 0 ? selectedAnimation : undefined}
          onSave={handleSave}
          width={80}
          height={24}
        />
      </div>

      {/* Saved Animations */}
      {savedAnimations.length > 0 && (
        <div style={{
          padding: '2rem',
          borderTop: '1px solid rgb(var(--border))',
        }}>
          <h3 style={{ 
            fontSize: '1rem', 
            marginBottom: '1rem',
            color: 'rgb(var(--text-primary))',
          }}>
            Saved Animations
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem',
          }}>
            {savedAnimations.map((animation, i) => (
              <div 
                key={i}
                style={{
                  padding: '1rem',
                  backgroundColor: 'rgb(var(--surface-1))',
                  border: '1px solid rgb(var(--border))',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}>
                  <span style={{ fontWeight: 'bold' }}>{animation.name}</span>
                  <button
                    onClick={() => setSelectedAnimation(animation.frames)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: 'rgb(var(--surface-2))',
                      border: '1px solid rgb(var(--border))',
                      color: 'rgb(var(--text-primary))',
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                    }}
                  >
                    Load
                  </button>
                </div>
                <div style={{
                  height: '100px',
                  overflow: 'hidden',
                  backgroundColor: 'rgb(var(--background-start))',
                  padding: '0.5rem',
                }}>
                  <AsciiEngine
                    frames={animation.frames}
                    fps={8}
                    loop={true}
                    style={{
                      fontSize: '8px',
                      lineHeight: '10px',
                      opacity: 0.8,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
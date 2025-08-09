'use client';

import { useState, useRef, useCallback } from 'react';
import { AsciiEngine } from './index';

interface AsciiEditorProps {
  initialFrames?: string[];
  width?: number;
  height?: number;
  onSave?: (frames: string[]) => void;
  className?: string;
}

export function AsciiEditor({
  initialFrames = [''],
  width = 40,
  height = 20,
  onSave,
  className = '',
}: AsciiEditorProps) {
  const [frames, setFrames] = useState<string[]>(initialFrames);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [clipboard, setClipboard] = useState<string>('');
  
  const currentFrame = frames[currentFrameIndex] || '';

  const updateCurrentFrame = useCallback((value: string) => {
    const newFrames = [...frames];
    newFrames[currentFrameIndex] = value;
    setFrames(newFrames);
  }, [frames, currentFrameIndex]);

  const addFrame = useCallback(() => {
    const newFrames = [...frames, currentFrame];
    setFrames(newFrames);
    setCurrentFrameIndex(newFrames.length - 1);
  }, [frames, currentFrame]);

  const duplicateFrame = useCallback(() => {
    const newFrames = [...frames];
    newFrames.splice(currentFrameIndex + 1, 0, currentFrame);
    setFrames(newFrames);
    setCurrentFrameIndex(currentFrameIndex + 1);
  }, [frames, currentFrame, currentFrameIndex]);

  const deleteFrame = useCallback(() => {
    if (frames.length <= 1) return;
    const newFrames = frames.filter((_, i) => i !== currentFrameIndex);
    setFrames(newFrames);
    setCurrentFrameIndex(Math.max(0, currentFrameIndex - 1));
  }, [frames, currentFrameIndex]);

  const copyFrame = useCallback(() => {
    setClipboard(currentFrame);
  }, [currentFrame]);

  const pasteFrame = useCallback(() => {
    if (!clipboard) return;
    updateCurrentFrame(clipboard);
  }, [clipboard, updateCurrentFrame]);

  const clearFrame = useCallback(() => {
    updateCurrentFrame(Array(height).fill(' '.repeat(width)).join('\n'));
  }, [height, width, updateCurrentFrame]);

  const insertCharacter = useCallback((char: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newValue = 
      currentFrame.substring(0, start) + 
      char + 
      currentFrame.substring(end);
    updateCurrentFrame(newValue);
    
    // Restore cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = start + char.length;
        textareaRef.current.selectionEnd = start + char.length;
        textareaRef.current.focus();
      }
    }, 0);
  }, [currentFrame, updateCurrentFrame]);

  const exportFrames = useCallback(() => {
    const json = JSON.stringify(frames, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascii-animation.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [frames]);

  const importFrames = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          setFrames(imported);
          setCurrentFrameIndex(0);
        }
      } catch (err) {
        console.error('Failed to import frames:', err);
      }
    };
    reader.readAsText(file);
  }, []);

  const asciiChars = [
    '░', '▒', '▓', '█', '▀', '▄', '■', '□', '▪', '▫',
    '●', '○', '◐', '◑', '◒', '◓', '◔', '◕', '◖', '◗',
    '╔', '╗', '╚', '╝', '║', '═', '╠', '╣', '╦', '╩',
    '┌', '┐', '└', '┘', '│', '─', '├', '┤', '┬', '┴',
    '▲', '▼', '◄', '►', '◆', '◇', '★', '☆', '♦', '♠',
    '·', ':', ';', '=', '+', '-', '*', '#', '@', '~',
    '≈', '∿', '×', '÷', '±', '≠', '≤', '≥', '∞', 'Ω',
  ];

  return (
    <div className={className} style={{
      display: 'flex',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: 'rgb(var(--background-start))',
      border: '1px solid rgb(var(--border))',
    }}>
      {/* Editor Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={addFrame}>New Frame</button>
          <button onClick={duplicateFrame}>Duplicate</button>
          <button onClick={deleteFrame} disabled={frames.length <= 1}>Delete</button>
          <button onClick={clearFrame}>Clear</button>
          <button onClick={copyFrame}>Copy</button>
          <button onClick={pasteFrame} disabled={!clipboard}>Paste</button>
          <button onClick={exportFrames}>Export JSON</button>
          <label style={{ cursor: 'pointer' }}>
            Import JSON
            <input 
              type="file" 
              accept=".json" 
              onChange={importFrames}
              style={{ display: 'none' }}
            />
          </label>
          {onSave && (
            <button onClick={() => onSave(frames)} style={{ marginLeft: 'auto' }}>
              Save Animation
            </button>
          )}
        </div>

        {/* Frame Navigator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            onClick={() => setCurrentFrameIndex(Math.max(0, currentFrameIndex - 1))}
            disabled={currentFrameIndex === 0}
          >
            ←
          </button>
          <span style={{ fontFamily: 'monospace' }}>
            Frame {currentFrameIndex + 1} / {frames.length}
          </span>
          <button 
            onClick={() => setCurrentFrameIndex(Math.min(frames.length - 1, currentFrameIndex + 1))}
            disabled={currentFrameIndex === frames.length - 1}
          >
            →
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)} style={{ marginLeft: 'auto' }}>
            {isPlaying ? 'Stop Preview' : 'Preview'}
          </button>
        </div>

        {/* Character Palette */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '0.25rem',
          padding: '0.5rem',
          border: '1px solid rgb(var(--border))',
          maxHeight: '100px',
          overflowY: 'auto',
        }}>
          {asciiChars.map((char, i) => (
            <button
              key={i}
              onClick={() => insertCharacter(char)}
              style={{
                width: '1.5rem',
                height: '1.5rem',
                fontFamily: 'monospace',
                fontSize: '1rem',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={`Insert ${char}`}
            >
              {char}
            </button>
          ))}
        </div>

        {/* Text Editor */}
        <textarea
          ref={textareaRef}
          value={currentFrame}
          onChange={(e) => updateCurrentFrame(e.target.value)}
          style={{
            flex: 1,
            fontFamily: 'monospace',
            fontSize: '12px',
            lineHeight: '14px',
            padding: '0.5rem',
            backgroundColor: 'rgb(var(--surface-1))',
            border: '1px solid rgb(var(--border))',
            color: 'rgb(var(--text-primary))',
            resize: 'none',
            minHeight: '300px',
          }}
          spellCheck={false}
          placeholder={`Enter ASCII art here (${width}×${height} characters)`}
        />

        {/* Size Info */}
        <div style={{ 
          fontSize: '0.75rem', 
          color: 'rgb(var(--text-secondary))',
          fontFamily: 'monospace',
        }}>
          Size: {currentFrame.split('\n')[0]?.length || 0}×{currentFrame.split('\n').length} 
          (target: {width}×{height})
        </div>
      </div>

      {/* Preview Panel */}
      <div style={{ 
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        <h3 style={{ margin: 0, fontSize: '0.875rem' }}>Preview</h3>
        <div style={{
          flex: 1,
          border: '1px solid rgb(var(--border))',
          padding: '1rem',
          backgroundColor: 'rgb(var(--surface-1))',
          overflow: 'auto',
        }}>
          {isPlaying ? (
            <AsciiEngine
              frames={frames}
              fps={12}
              loop={true}
              style={{
                fontSize: '10px',
                lineHeight: '12px',
                opacity: 1,
              }}
            />
          ) : (
            <pre style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              lineHeight: '12px',
              margin: 0,
            }}>
              {currentFrame}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
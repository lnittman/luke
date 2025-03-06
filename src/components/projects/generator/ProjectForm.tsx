import { ChangeEvent, FormEvent } from 'react';
import clsx from 'clsx';
import { ProjectFormProps } from './interfaces';

export const ProjectForm = ({
  projectName,
  setProjectName,
  inputValue,
  setInputValue,
  handleSubmit,
  isGenerating,
  generateRandomAppIdea,
  isGeneratingRandomIdea,
  nameInputRef,
  inputRef
}: ProjectFormProps) => {
  
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {/* Project Name Input */}
      <div className="space-y-2">
        <label htmlFor="project-name" className="text-xs sm:text-sm font-semibold">
          Project Name
        </label>
        <input
          id="project-name"
          type="text"
          ref={nameInputRef}
          value={projectName}
          onChange={handleNameChange}
          placeholder="Project name (optional)"
          className="w-full px-3 py-2 text-xs sm:text-sm rounded-md bg-[rgb(var(--input-background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent"
        />
      </div>
      
      {/* Project Description Input */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="project-description" className="text-xs sm:text-sm font-semibold">
            Project Description
          </label>
          <button
            type="button"
            onClick={generateRandomAppIdea}
            disabled={isGeneratingRandomIdea || isGenerating}
            className={clsx(
              "text-[10px] sm:text-xs font-medium py-1 px-2 rounded-md",
              isGeneratingRandomIdea || isGenerating
                ? "bg-[rgb(var(--muted))] text-[rgb(var(--muted-foreground))]"
                : "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] hover:bg-[rgb(var(--primary-hover))]"
            )}
          >
            {isGeneratingRandomIdea ? "Generating..." : "🌱 Sprout Idea"}
          </button>
        </div>
        <textarea
          id="project-description"
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Describe your project idea or type of app you want to build"
          className="w-full px-3 py-2 text-xs sm:text-sm rounded-md bg-[rgb(var(--input-background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent min-h-[100px] resize-none"
        />
      </div>
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={isGenerating || !inputValue.trim()}
        className={clsx(
          "w-full py-2 px-4 font-medium rounded-md text-center text-xs sm:text-sm mt-4",
          isGenerating || !inputValue.trim()
            ? "bg-[rgb(var(--muted))] text-[rgb(var(--muted-foreground))]"
            : "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] hover:bg-[rgb(var(--primary-hover))]"
        )}
      >
        {isGenerating ? "Generating Project..." : "Generate Project"}
      </button>
    </form>
  );
}; 
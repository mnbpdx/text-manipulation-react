import React, { useState, useRef, useEffect } from 'react';
import { summarizeText } from './api/textApi';

const BonoboParagraph = () => {
  // Initial text content about bonobos
  const initialText = "Bonobos are fascinating primates closely related to chimpanzees and humans. They are known for their peaceful nature and complex social structures. Unlike many primates, bonobo societies are matriarchal, with females holding dominant roles. These intelligent apes are endemic to the Democratic Republic of Congo and are unfortunately endangered due to habitat loss and hunting.";
  
  // State variables
  const [text, setText] = useState(initialText); // Current text content
  const [highlightedWords, setHighlightedWords] = useState({}); // Object to track highlighted words
  const [isDragging, setIsDragging] = useState(false); // Flag for drag selection
  const [startIndex, setStartIndex] = useState(null); // Start index of drag selection
  const [endIndex, setEndIndex] = useState(null); // End index of drag selection
  const [isEditing, setIsEditing] = useState(false); // Flag for edit mode
  const [initialHighlightState, setInitialHighlightState] = useState(false); // Initial highlight state for drag selection
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Refs for DOM elements
  const paragraphRef = useRef(null);
  const textareaRef = useRef(null);

  // Effect to handle global mouseup event
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Effect to adjust textarea height in edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing, text]);

  // Handle word interactions (click and drag)
  const handleWordInteraction = (index, interactionType) => {
    if (isEditing) return; // Ignore interactions in edit mode

    if (interactionType === 'mousedown') {
      // Start of interaction (click or drag)
      setIsDragging(true);
      setStartIndex(index);
      setEndIndex(index);
      // Set initial highlight state (opposite of current state)
      setInitialHighlightState(!highlightedWords[index]);
      // Toggle highlight for the clicked word
      setHighlightedWords(prev => ({ ...prev, [index]: !prev[index] }));
    } else if (interactionType === 'mouseenter' && isDragging) {
      // Update end index during drag
      setEndIndex(index);
    }
  };

  // Handle mouse up event
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);
      
      // Apply highlight state to all words in the selection range
      setHighlightedWords(prev => {
        const newHighlightedWords = { ...prev };
        for (let i = start; i <= end; i++) {
          newHighlightedWords[i] = initialHighlightState;
        }
        return newHighlightedWords;
      });
    }
    // Reset selection indices
    setStartIndex(null);
    setEndIndex(null);
  };

  // Effect to update highlighted words during drag
  useEffect(() => {
    if (isDragging && startIndex !== null && endIndex !== null) {
      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);
      
      // Update highlighted words in real-time during drag
      setHighlightedWords(prev => {
        const newHighlightedWords = { ...prev };
        for (let i = start; i <= end; i++) {
          newHighlightedWords[i] = initialHighlightState;
        }
        return newHighlightedWords;
      });
    }
  }, [isDragging, startIndex, endIndex, initialHighlightState]);

  // Create summary paragraph from highlighted words
  const reduceParagraph = () => {
    const words = text.split(' ');
    const selectedWords = words.filter((_, index) => highlightedWords[index]);
    const newText = selectedWords.join(' ');
    console.log('Reduced text:', newText);
    setText(newText);
    setHighlightedWords({});
    setIsEditing(false);
  };

  // Reset text to original content
  const resetToOriginal = () => {
    console.log('Resetting to original text:', initialText);
    setText(initialText);
    setHighlightedWords({});
    setIsEditing(false);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      setHighlightedWords({});
    }
    setIsEditing(!isEditing);
  };

  // Add this new function
  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const response = await summarizeText(text);
      const summary = response.summary;
      setText(summary);
      setHighlightedWords({});
      setIsEditing(false);
    } catch (error) {
      console.error('Error summarizing text:', error);
      // Optionally, you can add user feedback here, e.g., using a toast notification
    } finally {
      setIsSummarizing(false);
    }
  };

  // Split text into array of words with type checking
  const words = (typeof text === 'string' ? text : String(text)).split(' ');

  return (
    <div className="max-w-2xl mx-auto p-4">
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            console.log('Textarea onChange value:', e.target.value);
            setText(e.target.value);
          }}
          className="w-full p-2 border border-gray-300 rounded mb-4 resize-none"
          rows={5}
        />
      ) : (
        // Render paragraph with interactive words
        <p className="mb-4 select-none" ref={paragraphRef}>
          {words.map((word, index) => (
            <span
              key={index}
              onMouseDown={() => handleWordInteraction(index, 'mousedown')}
              onMouseEnter={() => handleWordInteraction(index, 'mouseenter')}
              onMouseUp={handleMouseUp}
              className={`cursor-pointer ${
                highlightedWords[index] ? 'bg-yellow-200' : ''
              } hover:bg-yellow-100 transition-colors duration-200`}
            >
              {word}{' '}
            </span>
          ))}
        </p>
      )}
      {/* Control buttons */}
      <div className="flex space-x-2">
        <button 
          onClick={reduceParagraph}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={isEditing || Object.keys(highlightedWords).length === 0}
        >
          Reduce
        </button>
        <button 
          onClick={resetToOriginal}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          disabled={isEditing && text === initialText}
        >
          Reset to Original
        </button>
        <button 
          onClick={toggleEditMode}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          {isEditing ? 'Save Edits' : 'Edit Text'}
        </button>
        {/* Add the new Summarize button */}
        <button 
          onClick={handleSummarize}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          disabled={isEditing || isSummarizing}
        >
          {isSummarizing ? 'Summarizing...' : 'Summarize'}
        </button>
      </div>
    </div>
  );
};

export default BonoboParagraph;

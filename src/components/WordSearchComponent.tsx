"use client";

import React, { useState } from 'react';
import {
  generateWordSearch,
} from '../utils/wordSearchUtils';

const WORDS = ['REACT', 'JAVASCRIPT', 'NEXT', 'COMPONENT', 'HOOK', 'STATE'];

const getMaxWordLength = (words: string[]) => words.reduce((max, w) => Math.max(max, w.length), 0);

const WordSearchComponent: React.FC = () => {
  const [words, setWords] = useState([...WORDS]);
  const maxWordLength = getMaxWordLength(words);
  const [width, setWidth] = useState(maxWordLength + 2);
  const [height, setHeight] = useState(maxWordLength + 2);
  const [allowDiagonal, setAllowDiagonal] = useState(false);
  const [fillGrid, setFillGrid] = useState(false);
  const [grid, setGrid] = useState<string[][]>(() => generateWordSearch(width, height, words, false, false));
  const [newWord, setNewWord] = useState('');

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), maxWordLength);
    setWidth(value);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), maxWordLength);
    setHeight(value);
  };

  const handleGenerate = () => {
    setGrid(generateWordSearch(width, height, words, allowDiagonal, fillGrid));
  };

  const handleAddWord = () => {
    const w = newWord.trim().toUpperCase();
    if (w && !words.includes(w)) {
      setWords([...words, w]);
      setNewWord('');
    }
  };

  const handleRemoveWord = (word: string) => {
    setWords(words.filter(w => w !== word));
  };

  // Regenerate grid when words change
  React.useEffect(() => {
    setGrid(generateWordSearch(width, height, words, allowDiagonal, fillGrid));
  }, [words, width, height, allowDiagonal, fillGrid]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4 flex gap-4 items-end flex-wrap">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">Width</label>
          <input
            type="number"
            min={maxWordLength}
            value={width}
            onChange={handleWidthChange}
            className="border rounded px-2 py-1 w-20 bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">Height</label>
          <input
            type="number"
            min={maxWordLength}
            value={height}
            onChange={handleHeightChange}
            className="border rounded px-2 py-1 w-20 bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>
        <div className="flex items-center h-10 mt-6">
          <input
            id="diagonal-toggle"
            type="checkbox"
            checked={allowDiagonal}
            onChange={e => setAllowDiagonal(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="diagonal-toggle" className="text-sm dark:text-gray-200">Allow Diagonal</label>
        </div>
        <div className="flex items-center h-10 mt-6">
          <input
            id="fill-grid-toggle"
            type="checkbox"
            checked={fillGrid}
            onChange={e => setFillGrid(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="fill-grid-toggle" className="text-sm dark:text-gray-200">Fill Empty Cells</label>
        </div>
        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Generate
        </button>
      </div>
      <div className="flex flex-col mt-6 pb-4">
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">Add Word</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newWord}
            onChange={e => setNewWord(e.target.value)}
            className="border rounded px-2 py-1 w-32 bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            onKeyDown={e => { if (e.key === 'Enter') handleAddWord(); }}
          />
          <button
            onClick={handleAddWord}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
          >
            Add
          </button>
        </div>
      </div>
      <table className="border-collapse mx-auto">
        <tbody>
          {grid.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, colIdx) => (
                <td
                  key={colIdx}
                  className="border w-8 h-8 text-center font-mono text-lg select-none bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6">
        <h2 className="font-semibold mb-2 dark:text-gray-200">Words to Find:</h2>
        <ul className="flex flex-wrap gap-2">
          {words.map(word => (
            <li
              key={word}
              className="relative group bg-gray-200 px-2 py-0 rounded text-sm font-mono dark:bg-gray-700 dark:text-gray-100 flex items-center w-auto pr-0"
            >
              <span className="mr-2 my-1 whitespace-nowrap flex-1">{word}</span>
              <button
                onClick={() => handleRemoveWord(word)}
                className="text-xs dark:text-gray-200 bg-gray-300 dark:bg-gray-600 rounded-r hover:dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500 opacity-0 group-hover:opacity-100 transition-opacity h-full px-4 flex items-center justify-center relative z-10"
                style={{ pointerEvents: 'auto' }}
                aria-label={`Remove ${word}`}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WordSearchComponent;

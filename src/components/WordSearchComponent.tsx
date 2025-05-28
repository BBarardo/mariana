"use client";

import React, { useState } from 'react';

type Direction = 'horizontal' | 'vertical';

interface WordPlacement {
    word: string;
    x: number;
    y: number;
    direction: Direction;
}

const WORDS = ['REACT', 'JAVASCRIPT', 'NEXT', 'COMPONENT', 'HOOK', 'STATE'];

const getMaxWordLength = (words: string[]) => words.reduce((max, w) => Math.max(max, w.length), 0);

function generateEmptyGrid(width: number, height: number): string[][] {
    return Array.from({ length: height }, () => Array(width).fill(''));
}

function canPlaceWord(grid: string[][], word: string, x: number, y: number, direction: Direction): boolean {
    if (direction === 'horizontal') {
        if (x + word.length > grid[0].length) return false;
        for (let i = 0; i < word.length; i++) {
            if (grid[y][x + i] && grid[y][x + i] !== word[i]) return false;
        }
    } else {
        if (y + word.length > grid.length) return false;
        for (let i = 0; i < word.length; i++) {
            if (grid[y + i][x] && grid[y + i][x] !== word[i]) return false;
        }
    }
    return true;
}

function placeWord(grid: string[][], word: string, x: number, y: number, direction: Direction): void {
    if (direction === 'horizontal') {
        for (let i = 0; i < word.length; i++) {
            grid[y][x + i] = word[i];
        }
    } else {
        for (let i = 0; i < word.length; i++) {
            grid[y + i][x] = word[i];
        }
    }
}

function fillEmptyCells(grid: string[][]): void {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (!grid[y][x]) {
                grid[y][x] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }
}

function generateWordSearch(width: number, height: number, words: string[]): string[][] {
    const grid = generateEmptyGrid(width, height);
    for (const word of words) {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 100) {
            const direction: Direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
            const maxX = direction === 'horizontal' ? width - word.length : width - 1;
            const maxY = direction === 'vertical' ? height - word.length : height - 1;
            const x = Math.floor(Math.random() * (maxX + 1));
            const y = Math.floor(Math.random() * (maxY + 1));
            if (canPlaceWord(grid, word, x, y, direction)) {
                placeWord(grid, word, x, y, direction);
                placed = true;
            }
            attempts++;
        }
    }
    fillEmptyCells(grid);
    return grid;
}

const WordSearchComponent: React.FC = () => {
    const maxWordLength = getMaxWordLength(WORDS);
    const [width, setWidth] = useState(maxWordLength + 2);
    const [height, setHeight] = useState(maxWordLength + 2);
    const [grid, setGrid] = useState<string[][]>(() => generateWordSearch(width, height, WORDS));

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(e.target.value), maxWordLength);
        setWidth(value);
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(e.target.value), maxWordLength);
        setHeight(value);
    };

    const handleGenerate = () => {
        setGrid(generateWordSearch(width, height, WORDS));
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="mb-4 flex gap-4 items-end">
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
                <button
                    onClick={handleGenerate}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                    Generate
                </button>
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
                    {WORDS.map(word => (
                        <li key={word} className="bg-gray-200 px-2 py-1 rounded text-sm font-mono dark:bg-gray-700 dark:text-gray-100">{word}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WordSearchComponent;

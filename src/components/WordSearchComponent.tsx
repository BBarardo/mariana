"use client";

import React, { useState } from 'react';

// Direction vectors for all possible directions
const DIRECTION_VECTORS = {
    horizontal: { dx: 1, dy: 0 },
    vertical: { dx: 0, dy: 1 },
    diagonal: { dx: 1, dy: 1 },
    'diagonal-reverse': { dx: 1, dy: -1 },
} as const;

type Direction = keyof typeof DIRECTION_VECTORS;

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
    const { dx, dy } = DIRECTION_VECTORS[direction];
    for (let i = 0; i < word.length; i++) {
        const xi = x + dx * i;
        const yi = y + dy * i;
        if (
            xi < 0 ||
            yi < 0 ||
            xi >= grid[0].length ||
            yi >= grid.length ||
            (grid[yi][xi] && grid[yi][xi] !== word[i])
        ) {
            return false;
        }
    }
    return true;
}

function placeWord(grid: string[][], word: string, x: number, y: number, direction: Direction): void {
    const { dx, dy } = DIRECTION_VECTORS[direction];
    for (let i = 0; i < word.length; i++) {
        const xi = x + dx * i;
        const yi = y + dy * i;
        grid[yi][xi] = word[i];
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

function findIntersections(word: string, placedWords: WordPlacement[], allowDiagonal: boolean) {
    // Find all possible intersections between the current word and already placed words
    const intersections: Array<{
        wordIdx: number;
        placed: WordPlacement;
        letter: string;
        wordLetterIdx: number;
        placedLetterIdx: number;
        direction: Direction;
    }> = [];
    const allowedDirections: Direction[] = allowDiagonal
        ? ['horizontal', 'vertical', 'diagonal', 'diagonal-reverse']
        : ['horizontal', 'vertical'];
    for (let placedIdx = 0; placedIdx < placedWords.length; placedIdx++) {
        const placed = placedWords[placedIdx];
        for (let i = 0; i < word.length; i++) {
            for (let j = 0; j < placed.word.length; j++) {
                if (word[i] === placed.word[j]) {
                    for (const direction of allowedDirections) {
                        // Don't allow the same direction as the placed word (avoids parallel overlap)
                        if (direction !== placed.direction) {
                            intersections.push({
                                wordIdx: placedIdx,
                                placed,
                                letter: word[i],
                                wordLetterIdx: i,
                                placedLetterIdx: j,
                                direction,
                            });
                        }
                    }
                }
            }
        }
    }
    return intersections;
}

function generateWordSearch(width: number, height: number, words: string[], allowDiagonal: boolean): string[][] {
    // Main function to generate the word search grid
    const grid = generateEmptyGrid(width, height);
    // Keep track of placed words and their positions/directions
    const placedWords: WordPlacement[] = [];
    for (const word of words) {
        let placed = false;
        let attempts = 0;
        // Try to intersect with already placed words (randomly, not always)
        if (placedWords.length > 0 && Math.random() > 0.5) {
            const intersections = findIntersections(word, placedWords, allowDiagonal);
            // Shuffle intersections for randomness
            for (const intersection of intersections.sort(() => Math.random() - 0.5)) {
                const { placed: pw, wordLetterIdx, placedLetterIdx, direction } = intersection;
                const { dx, dy } = DIRECTION_VECTORS[direction];
                // Calculate starting x, y so that word[wordLetterIdx] aligns with placed word's placedLetterIdx
                const x = pw.x + dx * placedLetterIdx - dx * wordLetterIdx;
                const y = pw.y + dy * placedLetterIdx - dy * wordLetterIdx;
                // Check if this intersection placement is possible
                if (canPlaceWord(grid, word, x, y, direction)) {
                    placeWord(grid, word, x, y, direction);
                    placedWords.push({ word, x, y, direction });
                    placed = true;
                    break;
                }
            }
        }
        // If not placed by intersection, place randomly
        while (!placed && attempts < 100) {
            let directions: Direction[] = ['horizontal', 'vertical'];
            if (allowDiagonal) {
                directions.push('diagonal', 'diagonal-reverse');
            }
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const { dx, dy } = DIRECTION_VECTORS[direction];
            let minX = 0, minY = 0, maxX = width - 1, maxY = height - 1;
            if (dx === 1) maxX = width - word.length;
            if (dy === 1) maxY = height - word.length;
            const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
            const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
            if (canPlaceWord(grid, word, x, y, direction)) {
                placeWord(grid, word, x, y, direction);
                placedWords.push({ word, x, y, direction });
                placed = true;
            }
            attempts++;
        }
    }
    // fillEmptyCells(grid); // Optionally fill empty cells with random letters
    return grid;
}

const WordSearchComponent: React.FC = () => {
    const maxWordLength = getMaxWordLength(WORDS);
    const [width, setWidth] = useState(maxWordLength + 2);
    const [height, setHeight] = useState(maxWordLength + 2);
    const [allowDiagonal, setAllowDiagonal] = useState(false);
    const [grid, setGrid] = useState<string[][]>(() => generateWordSearch(width, height, WORDS, false));

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(e.target.value), maxWordLength);
        setWidth(value);
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(e.target.value), maxWordLength);
        setHeight(value);
    };

    const handleGenerate = () => {
        setGrid(generateWordSearch(width, height, WORDS, allowDiagonal));
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

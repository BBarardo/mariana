"use client";

import React, { useState } from 'react';

type Direction = 'horizontal' | 'vertical' | 'diagonal' | 'diagonal-reverse';

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
    // Defensive: check if grid is valid and has at least one row
    if (!grid.length || !grid[0].length) return false;
    if (direction === 'horizontal') {
        if (x < 0 || y < 0 || x + word.length > grid[0].length || y >= grid.length) return false;
        for (let i = 0; i < word.length; i++) {
            if (!grid[y] || grid[y][x + i] === undefined) return false;
            if (grid[y][x + i] && grid[y][x + i] !== word[i]) return false;
        }
    } else if (direction === 'vertical') {
        if (x < 0 || y < 0 || y + word.length > grid.length || x >= grid[0].length) return false;
        for (let i = 0; i < word.length; i++) {
            if (!grid[y + i] || grid[y + i][x] === undefined) return false;
            if (grid[y + i][x] && grid[y + i][x] !== word[i]) return false;
        }
    } else if (direction === 'diagonal') {
        if (x < 0 || y < 0 || x + word.length > grid[0].length || y + word.length > grid.length) return false;
        for (let i = 0; i < word.length; i++) {
            if (!grid[y + i] || grid[y + i][x + i] === undefined) return false;
            if (grid[y + i][x + i] && grid[y + i][x + i] !== word[i]) return false;
        }
    } else {
        // diagonal-reverse (left-to-right, bottom-to-top)
        if (x < 0 || y < 0 || x + word.length > grid[0].length || y - word.length + 1 < 0) return false;
        for (let i = 0; i < word.length; i++) {
            if (!grid[y - i] || grid[y - i][x + i] === undefined) return false;
            if (grid[y - i][x + i] && grid[y - i][x + i] !== word[i]) return false;
        }
    }
    return true;
}

function placeWord(grid: string[][], word: string, x: number, y: number, direction: Direction): void {
    if (direction === 'horizontal') {
        for (let i = 0; i < word.length; i++) {
            grid[y][x + i] = word[i];
        }
    } else if (direction === 'vertical') {
        for (let i = 0; i < word.length; i++) {
            grid[y + i][x] = word[i];
        }
    } else if (direction === 'diagonal') {
        for (let i = 0; i < word.length; i++) {
            grid[y + i][x + i] = word[i];
        }
    } else {
        // diagonal-reverse (left-to-right, bottom-to-top)
        for (let i = 0; i < word.length; i++) {
            grid[y - i][x + i] = word[i];
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

function findIntersections(word: string, placedWords: { word: string, x: number, y: number, direction: Direction }[], grid: string[][], allowDiagonal: boolean) {
    // Find all possible intersections between the current word and already placed words
    const intersections: Array<{
        wordIdx: number;
        placed: typeof placedWords[number];
        letter: string;
        wordLetterIdx: number;
        placedLetterIdx: number;
        direction: Direction;
    }> = [];
    for (let placedIdx = 0; placedIdx < placedWords.length; placedIdx++) {
        const placed = placedWords[placedIdx];
        for (let i = 0; i < word.length; i++) {
            for (let j = 0; j < placed.word.length; j++) {
                if (word[i] === placed.word[j]) {
                    if (placed.direction === 'horizontal') {
                        if (allowDiagonal) {
                            intersections.push({ wordIdx: placedIdx, placed, letter: word[i], wordLetterIdx: i, placedLetterIdx: j, direction: 'diagonal' });
                            intersections.push({ wordIdx: placedIdx, placed, letter: word[i], wordLetterIdx: i, placedLetterIdx: j, direction: 'diagonal-reverse' });
                        }
                        intersections.push({ wordIdx: placedIdx, placed, letter: word[i], wordLetterIdx: i, placedLetterIdx: j, direction: 'vertical' });
                    } else if (placed.direction === 'vertical') {
                        if (allowDiagonal) {
                            intersections.push({ wordIdx: placedIdx, placed, letter: word[i], wordLetterIdx: i, placedLetterIdx: j, direction: 'diagonal' });
                            intersections.push({ wordIdx: placedIdx, placed, letter: word[i], wordLetterIdx: i, placedLetterIdx: j, direction: 'diagonal-reverse' });
                        }
                        intersections.push({ wordIdx: placedIdx, placed, letter: word[i], wordLetterIdx: i, placedLetterIdx: j, direction: 'horizontal' });
                    } else if (allowDiagonal && (placed.direction === 'diagonal' || placed.direction === 'diagonal-reverse')) {
                        intersections.push({ wordIdx: placedIdx, placed, letter: word[i], wordLetterIdx: i, placedLetterIdx: j, direction: 'horizontal' });
                        intersections.push({ wordIdx: placedIdx, placed, letter: word[i], wordLetterIdx: i, placedLetterIdx: j, direction: 'vertical' });
                        if (allowDiagonal) {
                            intersections.push({ wordIdx: placedIdx, placed, letter: word[i], wordLetterIdx: i, placedLetterIdx: j, direction: 'diagonal' });
                            intersections.push({ wordIdx: placedIdx, placed, letter: word[i], wordLetterIdx: i, placedLetterIdx: j, direction: 'diagonal-reverse' });
                        }
                    }
                }
            }
        }
    }
    return intersections;
}

function canPlaceIntersectingWord(grid: string[][], word: string, x: number, y: number, direction: Direction, intersectionIdx: number) {
    // Check if the word can be placed at (x, y) in the given direction without conflicts
    for (let i = 0; i < word.length; i++) {
        let xi = x, yi = y;
        if (direction === 'horizontal') xi += i;
        else if (direction === 'diagonal') { xi += i; yi += i; }
        else if (direction === 'diagonal-reverse') { xi += i; yi -= i; }
        else yi += i;
        // Out of bounds check
        if (xi < 0 || xi >= grid[0].length || yi < 0 || yi >= grid.length) return false;
        // If cell is not empty and not the same letter, can't place
        if (grid[yi][xi] && grid[yi][xi] !== word[i]) return false;
    }
    return true;
}

function placeIntersectingWord(grid: string[][], word: string, x: number, y: number, direction: Direction) {
    // Actually place the word on the grid at (x, y) in the given direction
    for (let i = 0; i < word.length; i++) {
        let xi = x, yi = y;
        if (direction === 'horizontal') xi += i;
        else if (direction === 'diagonal') { xi += i; yi += i; }
        else if (direction === 'diagonal-reverse') { xi += i; yi -= i; }
        else yi += i;
        grid[yi][xi] = word[i];
    }
}

function generateWordSearch(width: number, height: number, words: string[], allowDiagonal: boolean): string[][] {
    // Main function to generate the word search grid
    const grid = generateEmptyGrid(width, height);
    // Keep track of placed words and their positions/directions
    const placedWords: { word: string, x: number, y: number, direction: Direction }[] = [];
    for (const word of words) {
        let placed = false;
        let attempts = 0;
        // Try to intersect with already placed words (randomly, not always)
        if (placedWords.length > 0 && Math.random() > 0.5) {
            const intersections = findIntersections(word, placedWords, grid, allowDiagonal);
            // Shuffle intersections for randomness
            for (const intersection of intersections.sort(() => Math.random() - 0.5)) {
                const { placed: pw, wordLetterIdx, placedLetterIdx, direction } = intersection;
                let x, y;
                if (direction === 'horizontal') {
                    x = pw.x - wordLetterIdx;
                    y = pw.y + placedLetterIdx;
                } else if (direction === 'vertical') {
                    x = pw.x + placedLetterIdx;
                    y = pw.y - wordLetterIdx;
                } else if (direction === 'diagonal') {
                    x = pw.x - wordLetterIdx;
                    y = pw.y - wordLetterIdx + placedLetterIdx;
                } else {
                    // diagonal-reverse (left-to-right, bottom-to-top)
                    x = pw.x - wordLetterIdx;
                    y = pw.y + wordLetterIdx - placedLetterIdx;
                }
                // Check if this intersection placement is possible
                if (canPlaceIntersectingWord(grid, word, x, y, direction, wordLetterIdx)) {
                    placeIntersectingWord(grid, word, x, y, direction);
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
            let maxX, maxY;
            if (direction === 'horizontal') {
                maxX = width - word.length;
                maxY = height - 1;
            } else if (direction === 'vertical') {
                maxX = width - 1;
                maxY = height - word.length;
            } else if (direction === 'diagonal') {
                maxX = width - word.length;
                maxY = height - word.length;
            } else {
                // diagonal-reverse (left-to-right, bottom-to-top)
                maxX = width - word.length;
                maxY = height - 1;
            }
            let x, y;
            if (direction === 'diagonal-reverse') {
                x = Math.floor(Math.random() * (maxX + 1));
                y = Math.floor(Math.random() * (maxY + 1)) + (word.length - 1);
            } else {
                x = Math.floor(Math.random() * (maxX + 1));
                y = Math.floor(Math.random() * (maxY + 1));
            }
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

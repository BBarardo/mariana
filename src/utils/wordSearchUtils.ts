// Utility functions and types for the word search puzzle

export const DIRECTION_VECTORS = {
  horizontal: { dx: 1, dy: 0 },
  vertical: { dx: 0, dy: 1 },
  diagonal: { dx: 1, dy: 1 },
  'diagonal-reverse': { dx: 1, dy: -1 },
} as const;

export type Direction = keyof typeof DIRECTION_VECTORS;

export function generateEmptyGrid(width: number, height: number): string[][] {
  return Array.from({ length: height }, () => Array(width).fill(''));
}

export function canPlaceWord(
  grid: string[][],
  word: string,
  x: number,
  y: number,
  direction: Direction
): boolean {
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

export function placeWord(
  grid: string[][],
  word: string,
  x: number,
  y: number,
  direction: Direction
): void {
  const { dx, dy } = DIRECTION_VECTORS[direction];
  for (let i = 0; i < word.length; i++) {
    const xi = x + dx * i;
    const yi = y + dy * i;
    grid[yi][xi] = word[i];
  }
}

export function fillEmptyCells(grid: string[][]): void {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (!grid[y][x]) {
        grid[y][x] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }
}

import type { WordPlacement } from '../types';

export function findIntersections(
  word: string,
  placedWords: WordPlacement[],
  allowDiagonal: boolean
) {
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

export function generateWordSearch(
  width: number,
  height: number,
  words: string[],
  allowDiagonal: boolean,
  fillGrid: boolean = false
): string[][] {
  const grid = generateEmptyGrid(width, height);
  const placedWords: WordPlacement[] = [];
  for (const word of words) {
    let placed = false;
    let attempts = 0;
    if (placedWords.length > 0 && Math.random() > 0.5) {
      const intersections = findIntersections(word, placedWords, allowDiagonal);
      for (const intersection of intersections.sort(
        () => Math.random() - 0.5
      )) {
        const {
          placed: pw,
          wordLetterIdx,
          placedLetterIdx,
          direction,
        } = intersection;
        const { dx, dy } = DIRECTION_VECTORS[direction];
        const x = pw.x + dx * placedLetterIdx - dx * wordLetterIdx;
        const y = pw.y + dy * placedLetterIdx - dy * wordLetterIdx;
        if (canPlaceWord(grid, word, x, y, direction)) {
          placeWord(grid, word, x, y, direction);
          placedWords.push({ word, x, y, direction });
          placed = true;
          break;
        }
      }
    }
    while (!placed && attempts < 100) {
      const directions: Direction[] = ['horizontal', 'vertical'];
      if (allowDiagonal) {
        directions.push('diagonal', 'diagonal-reverse');
      }
      const direction =
        directions[Math.floor(Math.random() * directions.length)];
      const { dx, dy } = DIRECTION_VECTORS[direction];
      const minX = 0,
        minY = 0,
        maxX = width - 1,
        maxY = height - 1;
      let xMax = maxX,
        yMax = maxY;
      if (dx === 1) xMax = width - word.length;
      if (dy === 1) yMax = height - word.length;
      const x = Math.floor(Math.random() * (xMax - minX + 1)) + minX;
      const y = Math.floor(Math.random() * (yMax - minY + 1)) + minY;
      if (canPlaceWord(grid, word, x, y, direction)) {
        placeWord(grid, word, x, y, direction);
        placedWords.push({ word, x, y, direction });
        placed = true;
      }
      attempts++;
    }
  }
  if (fillGrid) {
    fillEmptyCells(grid);
  }
  return grid;
}

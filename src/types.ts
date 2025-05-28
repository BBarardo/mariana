import type { Direction } from './utils/wordSearchUtils';

export type LetterDict = { [key: string]: number };

export interface WordPlacement {
  word: string;
  x: number;
  y: number;
  direction: Direction;
}

'use client'
import React, { useState } from 'react';
import ToPDF from './ToPDF';
import type { LetterDict } from '@/types';

const InputText: React.FC = ({ }) => {
    const [text, setText] = useState('');
    const [words, setWords] = useState<string[]>([]);
    const [wordsCode, setWordsCode] = useState<LetterDict>({});

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        setText(event.target.value);
        const words = event.target.value.split('\n').filter(word => word !== '').map(word => word.trim());

        setWords(words);
        const letters = new Set(words.join(''));

        const letterDict: LetterDict = wordsCode;
        const availableNumbers = Array.from({ length: 101 }, (_, i) => i);

        letters.forEach(letter => {
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            letterDict[letter] = availableNumbers[randomIndex];
            availableNumbers.splice(randomIndex, 1);
        });

        console.log(letterDict);
        setWordsCode(letterDict);
    };

    const reset = () => {
        setWords([]);
        setWordsCode({});
        setText('');
    };

    const Tables = () => <>
        <table id='code-table' className="m-5 table-auto border-collapse border border-gray-400">
            <thead>
                <tr>
                    <th className="px-4 py-2 border border-gray-400">Word</th>
                    {Object.keys(wordsCode).map((letter, index) => (
                        <th key={index} className="border px-4 py-2 border-gray-400">{letter}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="px-4 py-2 border border-gray-400">Code</td>
                    {Object.keys(wordsCode).map((letter, index) => (
                        <td key={index} className="border px-4 py-2 border-gray-400">{wordsCode[letter]}</td>
                    ))}
                </tr>
            </tbody>
        </table>
        <table id='words-table' className="m-5 table-auto border-collapse border border-gray-400">
            <thead >
                <tr>
                    <th className="px-4 py-2 border border-gray-400">Word</th>
                    <th className="px-4 py-2 border border-gray-400">Code</th>
                </tr>
            </thead>
            <tbody>
                {words.map((word, index) => (
                    <tr key={index}>
                        <td className="px-4 py-2 border border-gray-400">{word}</td>
                        <td className="px-4 py-2 border border-gray-400">{word.split('').map(letter => wordsCode[letter]).join(' ')}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>

    return (
        <div className="p-4 flex flex-col items-center">
            <textarea
                rows={5}
                value={text}
                onChange={handleChange}
                className="m-5 border border-gray-300 p-2 rounded w-full max-w-lg"
                placeholder="Enter Text"
            />
            <Tables />
            <button type='button' onClick={reset} className="m-5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Reset
            </button>
            <ToPDF />
        </div>
    );
};

export default InputText;

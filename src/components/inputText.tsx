'use client'
import React, { useState } from 'react';

type LetterDict = { [key: string]: number };

const InputText: React.FC = ({ }) => {
    const [text, setText] = useState('');
    const [words, setWords] = useState<string[]>([]);
    const [wordsCode, setWordsCode] = useState<LetterDict>({});

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setText(event.target.value);
        const words = event.target.value.split(' ');

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

    return (
        <div className="p-4 flex flex-col items-center">
            <input
                type="text"
                value={text}
                onChange={handleChange}
                className="m-5 border border-gray-300 p-2 rounded w-full max-w-lg"
                placeholder="Enter Text"
            />
            <table className="m-5 table-auto border-collapse border border-gray-400">
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
            <table className="m-5 table-auto border-collapse border border-gray-400">
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
        </div>
    );
};

export default InputText;

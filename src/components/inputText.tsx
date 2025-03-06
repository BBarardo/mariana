'use client'
import React, { useState } from 'react';
import ToPDF from './ToPDF';
import type { LetterDict } from '@/types';
import Image from 'next/image';

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

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                const words = text.split('\n').filter(word => word !== '').map(word => word.trim());
                setWords(words);
                setText(text);
                const letters = new Set(words.join(''));

                const letterDict: LetterDict = {};
                const availableNumbers = Array.from({ length: 101 }, (_, i) => i);

                letters.forEach(letter => {
                    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
                    letterDict[letter] = availableNumbers[randomIndex];
                    availableNumbers.splice(randomIndex, 1);
                });

                setWordsCode(letterDict);
            };
            reader.readAsText(file);
        }
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
            <h1 className="my-2 text-2xl font-bold text-center">
                Write your each word on a new line
            </h1>
            <textarea
                rows={5}
                value={text}
                onChange={handleChange}
                className="m-5 border border-gray-300 p-2 rounded w-full max-w-lg"
                placeholder="Enter Text"
            />
            <h1 className="mb-2 text-center">
                OR
            </h1>
            <div className="flex items-center justify-center w-1/2 mb-3">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Image src={"/uploadFile.svg"} alt='upload file icon' width={50} height={50} />
                        <p className="mt-2 mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload </span>or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">.txt</p>
                    </div>
                    <input
                        className="hidden"
                        id="dropzone-file"
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload} />
                </label>
            </div>
            <Tables />
            <button type='button' onClick={reset} className="m-5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Reset
            </button>
            <ToPDF />
        </div>
    );
};

export default InputText;

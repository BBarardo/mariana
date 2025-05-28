import React from 'react';
import Image from 'next/image';
import type { LetterDict } from '@/types';
interface FileUploadProps {
  setWords: React.Dispatch<React.SetStateAction<string[]>>;
  setText: React.Dispatch<React.SetStateAction<string>>;
  setWordsCode: React.Dispatch<React.SetStateAction<LetterDict>>;
}


const FileUpload: React.FC<FileUploadProps> = ({ setWords, setText, setWordsCode }) => {

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

  return (
    <div className="flex items-center justify-center w-md mb-3">
      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
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
  );
};

export default FileUpload;
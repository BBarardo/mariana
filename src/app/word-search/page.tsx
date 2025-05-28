import React from 'react';
import WordSearchComponent from '../../components/WordSearchComponent';

const WordSearch: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-full p-4">
            <h1 className="text-3xl font-bold mb-4">Word Search</h1>
            <WordSearchComponent />
        </div>
    );
};

export default WordSearch;

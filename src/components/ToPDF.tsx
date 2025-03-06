import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ToPDF: React.FC = () => {
    const downloadPDF = () => {
        const doc = new jsPDF();

        autoTable(doc, { html: '#code-table' });
        autoTable(doc, { html: '#words-table', tableWidth: 80, margin: { top: 10, left: 70 }, rowPageBreak: 'auto', pageBreak: 'auto' });
        doc.save('file.pdf')
    };

    return (
        <button
            onClick={downloadPDF}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
            Export as PDF
        </button>
    );
};

export default ToPDF;

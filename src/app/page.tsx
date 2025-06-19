import Head from 'next/head';
import React from 'react';
import { DocumentForm } from './components/DocumentForm';

const Page: React.FC = () => {
    return (
        <>
            <Head>
                <title>Google Drive File Viewer</title>
                <meta name="description" content="View Google Drive files directly in your browser" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="min-h-screen bg-gray-100">
                <div className="container mx-auto px-4 py-8">
                    <header className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Google Drive File Viewer</h1>
                        <p className="text-gray-600">Enter a public Google Drive URL to view the file directly</p>
                    </header>
                    <DocumentForm />
                </div>
            </div>
        </>
    );
};

export default Page;

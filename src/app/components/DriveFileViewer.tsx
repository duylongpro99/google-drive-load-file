import React from 'react';
import { ExtendedDriveFile } from './DocumentForm';

interface DriveFileViewerProps {
    fileData: ExtendedDriveFile | null;
}

export const DriveFileViewer: React.FC<DriveFileViewerProps> = ({ fileData }) => {
    const renderFileViewer = () => {
        if (!fileData) return null;

        const { mimeType, embedLink, directLink, name } = fileData;

        // Handle different file types
        if (mimeType.startsWith('image/')) {
            return <img src={directLink} alt={name} className="max-w-full h-auto rounded-lg shadow-lg" style={{ maxHeight: '80vh' }} />;
        }

        if (mimeType === 'application/pdf') {
            return <iframe src={embedLink} className="w-full rounded-lg shadow-lg" style={{ height: '80vh' }} title={name} />;
        }

        if (mimeType.startsWith('video/')) {
            return (
                <video controls className="max-w-full h-auto rounded-lg shadow-lg" style={{ maxHeight: '80vh' }}>
                    <source src={directLink} type={mimeType} />
                    Your browser does not support the video tag.
                </video>
            );
        }

        if (mimeType.startsWith('audio/')) {
            return (
                <div className="p-8 bg-gray-50 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">{name}</h3>
                    <audio controls className="w-full">
                        <source src={directLink} type={mimeType} />
                        Your browser does not support the audio tag.
                    </audio>
                </div>
            );
        }

        if (mimeType.startsWith('text/') || mimeType === 'application/json' || mimeType === 'application/javascript') {
            return <iframe src={embedLink} className="w-full rounded-lg shadow-lg" style={{ height: '80vh' }} title={name} />;
        }

        // Google Workspace files
        if (mimeType.includes('google-apps')) {
            return <iframe src={embedLink} className="w-full rounded-lg shadow-lg" style={{ height: '80vh' }} title={name} />;
        }

        // Fallback for other file types
        return (
            <div className="p-8 bg-gray-50 rounded-lg shadow-lg text-center">
                <h3 className="text-lg font-semibold mb-4">{name}</h3>
                <p className="text-gray-600 mb-4">This file type ({mimeType}) cannot be previewed directly.</p>
                <a
                    href={directLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Download File
                </a>
            </div>
        );
    };

    return (
        <div className="w-full">
            {fileData && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-800">{fileData.name}</h2>
                    <p className="text-sm text-gray-600">
                        Type: {fileData.mimeType} | Size: {fileData.size || 'Unknown'}
                    </p>
                </div>
            )}
            <div className="flex justify-center">{renderFileViewer()}</div>
        </div>
    );
};

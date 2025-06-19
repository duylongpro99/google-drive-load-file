'use client';

import React, { useState } from 'react';
import { DriveFile } from '../../../lib/googleDrive';
import { DriveFileViewer } from './DriveFileViewer';

export interface ExtendedDriveFile extends DriveFile {
    directLink: string;
    embedLink: string;
    isViewable: boolean;
}

export const DocumentForm: React.FC = () => {
    const [fileData, setFileData] = useState<ExtendedDriveFile | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>();

    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const driveUrl = formData.get('driveUrl') as string;
        loadFile(driveUrl);
    };

    const isValidDriveUrl = (url: string): boolean => {
        const driveUrlPattern = /https:\/\/drive\.google\.com\/(file\/d\/|open\?id=)/;
        return driveUrlPattern.test(url);
    };

    const loadFile = async (fileUrl: string) => {
        try {
            setLoading(true);
            setError(null);

            // Extract file ID from URL
            const fileIdMatch = fileUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
            if (!fileIdMatch) {
                throw new Error('Invalid Google Drive URL');
            }

            const fileId = fileIdMatch[1];
            const response = await fetch(`/api/drive/${fileId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch file data');
            }

            const data = await response.json();
            setFileData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Loading file...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-2xl mx-auto mb-8">
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="driveUrl" className="block text-sm font-medium text-gray-700 mb-2">
                            Google Drive URL
                        </label>
                        <input
                            type="url"
                            id="driveUrl"
                            name="driveUrl"
                            placeholder="https://drive.google.com/file/d/FILE_ID/view"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        // disabled={!isValidDriveUrl(driveUrl)}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Load File
                    </button>
                </form>

                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <DriveFileViewer fileData={fileData} />
                    </div>
                </div>
            </div>
        </>
    );
};

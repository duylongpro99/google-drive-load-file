import { google } from 'googleapis';

export interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
    webViewLink: string;
    webContentLink: string;
    thumbnailLink?: string;
    size?: string;
}

export class GoogleDriveService {
    private drive;

    constructor() {
        const auth = new google.auth.GoogleAuth({
            apiKey: process.env.GOOGLE_DRIVE_API_KEY,
            scopes: [process.env.GOOGLE_API_URL!],
        });

        this.drive = google.drive({ version: 'v3', auth });
    }

    // Extract file ID from Google Drive URL
    extractFileId(url: string): string | null {
        const patterns = [/\/file\/d\/([a-zA-Z0-9-_]+)/, /id=([a-zA-Z0-9-_]+)/, /\/d\/([a-zA-Z0-9-_]+)/];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    }

    // Get file metadata
    async getFileMetadata(fileId: string): Promise<DriveFile | null> {
        try {
            const response = await this.drive.files.get({
                fileId,
                fields: 'id,name,mimeType,webViewLink,webContentLink,thumbnailLink,size',
            });

            return response.data as DriveFile;
        } catch (error) {
            console.error('Error fetching file metadata:', error);
            return null;
        }
    }

    // Get direct download link for public files
    getDirectLink(fileId: string): string {
        return `${process.env.GOOGLE_DRIVE_URL}/uc?export=download&id=${fileId}`;
    }

    // Get embed link for viewable files
    getEmbedLink(fileId: string): string {
        return `${process.env.GOOGLE_DRIVE_URL}/file/d/${fileId}/preview`;
    }

    // Check if file type is viewable in browser
    isViewableType(mimeType: string): boolean {
        const viewableTypes = [
            'image/',
            'application/pdf',
            'text/',
            'video/mp4',
            'video/webm',
            'audio/',
            'application/vnd.google-apps.document',
            'application/vnd.google-apps.spreadsheet',
            'application/vnd.google-apps.presentation',
        ];

        return viewableTypes.some((type) => mimeType.startsWith(type));
    }
}

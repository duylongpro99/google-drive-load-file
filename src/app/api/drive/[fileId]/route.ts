import { NextRequest, NextResponse } from 'next/server';
import { GoogleDriveService } from '../../../../../lib/googleDrive';

export async function GET(req: NextRequest, { params }: { params: { fileId: string } }) {
    const { fileId } = params;

    if (!fileId || typeof fileId !== 'string') {
        return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    try {
        const driveService = new GoogleDriveService();
        const fileMetadata = await driveService.getFileMetadata(fileId);

        if (!fileMetadata) {
            return NextResponse.json({ error: 'File not found or not accessible' }, { status: 400 });
        }

        const response = {
            ...fileMetadata,
            directLink: driveService.getDirectLink(fileId),
            embedLink: driveService.getEmbedLink(fileId),
            isViewable: driveService.isViewableType(fileMetadata.mimeType),
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { checkAuth } from '@/lib/auth-check';

export async function POST(request: NextRequest) {
  // Check authentication
  const authResult = await checkAuth();
  if (!authResult.authenticated) {
    return authResult.response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get('database') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file is a database file
    if (!file.name.endsWith('.db')) {
      return NextResponse.json(
        { error: 'Invalid file type. Must be a .db file' },
        { status: 400 }
      );
    }

    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const backupPath = path.join(
      process.cwd(),
      'prisma',
      `dev.backup-${Date.now()}.db`
    );

    // Create a backup of the current database before restoring
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, backupPath);
    }

    // Convert the uploaded file to buffer and write it
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate the file is a valid SQLite database by checking magic header
    const magicHeader = buffer.toString('ascii', 0, 16);
    if (!magicHeader.startsWith('SQLite format 3')) {
      // Restore the backup if validation fails
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, dbPath);
        fs.unlinkSync(backupPath);
      }
      return NextResponse.json(
        { error: 'Invalid database file. Not a valid SQLite database.' },
        { status: 400 }
      );
    }

    // Write the new database file
    fs.writeFileSync(dbPath, buffer);

    // Clean up the backup after successful restore
    if (fs.existsSync(backupPath)) {
      // Keep the backup for safety, but you could delete it
      // fs.unlinkSync(backupPath);
    }

    return NextResponse.json({
      success: true,
      message: 'Database restored successfully. Please refresh the page.',
      backupCreated: backupPath
    });
  } catch (error) {
    console.error('Restore error:', error);
    return NextResponse.json(
      { error: 'Failed to restore database' },
      { status: 500 }
    );
  }
}

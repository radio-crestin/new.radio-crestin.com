import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const path = searchParams.get('path');
    const tag = searchParams.get('tag');

    // Revalidate specific path if provided
    if (path) {
      revalidatePath(path);
      return NextResponse.json({
        message: `Revalidated path: ${path}`,
        timestamp: new Date().toISOString()
      });
    }

    // Revalidate specific tag if provided
    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({
        message: `Revalidated tag: ${tag}`,
        timestamp: new Date().toISOString()
      });
    }

    // Revalidate all common paths
    const pathsToRevalidate = [
      '/',
      '/api/stations',
      '/statistici',
      '/privacy-policy',
      '/terms-of-service'
    ];

    for (const pathToRevalidate of pathsToRevalidate) {
      revalidatePath(pathToRevalidate);
    }

    // Also revalidate common tags
    const tagsToRevalidate = [
      'stations',
      'statistics'
    ];

    for (const tagToRevalidate of tagsToRevalidate) {
      revalidateTag(tagToRevalidate);
    }

    return NextResponse.json({
      message: 'All pages revalidated successfully',
      revalidatedPaths: pathsToRevalidate,
      revalidatedTags: tagsToRevalidate,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in /api/revalidate:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}

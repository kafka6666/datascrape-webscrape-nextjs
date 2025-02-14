import { NextResponse } from 'next/server';
import { scrapeImages } from '@/lib/scraper';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { url, selector, outputDir } = await req.json();
    
    if (!url || !selector || !outputDir) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const absoluteOutputDir = path.join(process.cwd(), 'public', outputDir);
    const images = await scrapeImages(url, selector, absoluteOutputDir);

    return NextResponse.json({
      success: true,
      message: `Successfully scraped ${images.length} images`,
      images
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
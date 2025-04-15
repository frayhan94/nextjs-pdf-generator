import { NextRequest } from 'next/server';
import puppeteer from 'puppeteer-core';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const keys = Object.keys(body);

        // Input validation: only allow { url }
        if (keys.length !== 1 || !body.url) {
            const unexpected = keys.filter((key) => key !== 'url');
            return new Response(
                JSON.stringify({
                    error: `Invalid payload. ${
                        unexpected.length ? `Unexpected property: ${unexpected[0]}` : 'Missing url'
                    }`,
                }),
                { status: 400 }
            );
        }

        const browser = await puppeteer.connect({
            browserWSEndpoint: `wss://production-sfo.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
        });

        const page = await browser.newPage();

        // Navigate to the URL
        await page.goto(body.url, { waitUntil: 'domcontentloaded' });

        // Ensure all images are fully loaded
        await page.evaluate(() => {
            const images = Array.from(document.images);
            return Promise.all(
                images.map((img) =>
                    img.complete
                        ? Promise.resolve()
                        : new Promise<void>((res) => {
                            img.onload = img.onerror = () => res();
                        })
                )
            );
        });

        // Create PDF as a readable Node.js stream
        const nodePdfStream: any = await page.createPDFStream();

        // Convert Node stream to Web ReadableStream
        const reader = nodePdfStream[Symbol.asyncIterator]();

        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();

        const pump = async () => {
            while (true) {
                const { value, done } = await reader.next();
                if (done) break;
                await writer.write(value);
            }
            await writer.close();
            await browser.close();
        };

        pump();

        return new Response(readable, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="output.pdf"',
            },
        });
    } catch (error) {
        console.error('PDF generation error:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate PDF' }), {
            status: 500,
        });
    }
}

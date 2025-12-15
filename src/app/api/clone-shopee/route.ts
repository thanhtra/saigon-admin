// src/app/api/clone-tiktok/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import { Readable } from 'stream';
import puppeteer from 'puppeteer';


// Interface for Shopee product data
interface ShopeeProduct {
    name: string;
    price: string;
    image: string;
    affiliate_link: string;
}

/**
 * Scrapes product data from Shopee Affiliate or public search page
 * @param keyword - Search keyword (e.g., "áo thun")
 * @param limit - Number of products to scrape
 * @returns Array of ShopeeProduct or null if failed
 */
const crawlShopeeAffiliateByScraping = async (keyword: string, limit: number = 10): Promise<ShopeeProduct[] | null> => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const a = `https://shopee.vn/search?keyword=${encodeURIComponent(keyword)}`;
        console.log('sdafdsa', a)

        // Go to Shopee search page (publicly accessible alternative to affiliate dashboard)
        await page.goto(a, {
            waitUntil: 'networkidle2'
        });

        // Scrape product data
        const products = await page.evaluate((limit) => {
            const items = Array.from(document.querySelectorAll('.shopee-search-item-result__item')).slice(0, limit);
            return items.map(item => ({
                name: item.querySelector('div[class*="line-clamp-2.break-words.min-w-0 min-h-[2.5rem].text-sm"]')?.textContent || '',
                price: item.querySelector('span[class*="font-medium.text-base/5.truncate"]')?.textContent || '',
                image: item.querySelector('img')?.src || '',
                affiliate_link: item.querySelector('a')?.href || ''
            }));
        }, limit);

        console.log('dasfsdaf', products)

        // Optionally, add affiliate ID to links (manual step if not logged in)
        const affiliateId = '17306780152'; // Replace with your actual ID
        const enrichedProducts = products.map(product => ({
            ...product,
            affiliate_link: `${product.affiliate_link}?affiliate_id=${affiliateId}`
        }));

        // Save to file
        fs.writeFileSync('shopee_products.json', JSON.stringify(enrichedProducts, null, 2));
        console.log(`Scraped ${enrichedProducts.length} products`);

        await browser.close();
        return enrichedProducts;
    } catch (error: any) {
        console.error('Error scraping Shopee:', error.message);
        return null;
    }
};


export async function POST(req: NextRequest) {
    // Parse and type the request body
    // const body = await req.json() as RequestBody;
    // const { shoppeUrl, description } = body;

    // if (!shoppeUrl || !description) {
    //     return NextResponse.json({ error: 'Missing shoppeUrl or description' }, { status: 400 });
    // }

    // console.log('dsafsd', req)


    const products = await crawlShopeeAffiliateByScraping('áo thun', 5);
    if (products) {
        console.log('Scraped Products:', products);
    } else {
        console.log('Scraping failed');
    }

    // console.log('dsafsfsd', videoData)
    // if (!videoData) {
    //     return NextResponse.json({ error: 'Failed to download TikTok video' }, { status: 500 });
    // }



    // const success = await uploadToFacebookReels(videoData.filename, description);
    // if (success) {
    //     return NextResponse.json({ message: 'Successfully uploaded to Facebook Reels' }, { status: 200 });
    // } else {
    //     return NextResponse.json({ error: 'Failed to upload to Facebook Reels' }, { status: 500 });
    // }
}

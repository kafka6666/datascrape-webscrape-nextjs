import axios from 'axios';
import * as cheerio from 'cheerio';
import {extractCurrency, extractDescription, extractPrice} from '@/lib/utils';
import {PriceHistory} from "@/lib/models/product.model";
import * as fs from 'fs';
import * as path from 'path';

// BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 33335;
  const sessionId = (1000000 * Math.random()) | 0;

  // create a new axios instance with the proxy configuration
  const options = {
    proxy: {
      host: 'brd.superproxy.io',
      port: port,
      auth: {
        username: `${username}-session-${sessionId}`,
        password,
      },
      protocol: 'http',
    },
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    },
  };

export const scrapeUrlData = async (url: string) => {
  if (!url) return;

  try {
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    // extract the product title
    const title = $('#productTitle').text().trim();
    // extract the product price
    const currentPrice = extractPrice(
      $('.a-price-whole'),
      $('.priceToPay span.a-price-whole'),
      $('a.size.base.a-color-price'),
      $('.a-button-selected .a-color-base')
    );
    const originalPrice = extractPrice(
      $('#priceblock_ourprice'),
      $('.a-price.a-text-price span.a-offscreen'),
      $('#listPrice'),
      $('#priceblock_dealprice'),
      $('.a-size-base.a-color-price')
    );

    const outOfStock =
      $('#availability span').text().trim().toLowerCase() ===
      'currently unavailable';

    const images =
      $('#imgBlkFront').attr('data-a-dynamic-image') ||
      $('#landingImage').attr('data-a-dynamic-image') ||
      '{}';

    const imageUrls = Object.keys(JSON.parse(images));

    const currency = extractCurrency($('.a-price-symbol'));
    const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, '');

    const description = extractDescription(response);

    // Construct data object with scraped information
    return  {
      url,
      currency: currency || '$',
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [] as PriceHistory[],
      discountRate: Number(discountRate),
      category: 'category',
      reviewsCount: 100,
      stars: 4.5,
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };


  } catch (error) {
    throw new Error(`Failed to scrape data: ${error}`);
  }
};

interface ImageData {
  url: string;
  alt: string;
  filename: string;
}


export async function scrapeImages(url: string, selector: string, outputDir: string): Promise<ImageData[]> {
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Fetch the webpage
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);
    const images: ImageData[] = [];

    // Find all images matching the selector
    $(selector).each((_, element) => {
      const imgUrl = $(element).attr('src');
      const altText = $(element).attr('alt') || 'unnamed-image';
      
      if (imgUrl) {
        // Clean the URL if it's relative
        const absoluteUrl = imgUrl.startsWith('http') ? imgUrl : new URL(imgUrl, url).toString();
        const filename = `${altText.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.jpg`;
        
        images.push({
          url: absoluteUrl,
          alt: altText,
          filename
        });
      }
    });

    // Download all images
    const downloadPromises = images.map(async (image) => {
      try {
        const response = await axios({
          url: image.url,
          method: 'GET',
          responseType: 'stream'
        });

        const writer = fs.createWriteStream(path.join(outputDir, image.filename));
        response.data.pipe(writer);

        return new Promise<void>((resolve, reject) => {
          writer.on('finish', () => resolve());
          writer.on('error', reject);
        });
      } catch (error) {
        console.error(`Failed to download image ${image.url}:`, error);
      }
    });

    await Promise.all(downloadPromises);
    return images;
  } catch (error) {
    console.error('Error scraping images:', error);
    throw error;
  }
}

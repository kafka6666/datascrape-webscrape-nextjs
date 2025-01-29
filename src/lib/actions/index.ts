"use server";

import {scrapeUrlData} from "@/lib/scraper";

export const scrapeAndStoreData = async (productUrl: string) => {
    if (!productUrl) return;

    try {
        const scrapedData = await scrapeUrlData(productUrl);
        console.log(scrapedData);
        return scrapedData;
    } catch (error) {
        throw new Error(`Failed to create/update data: ${error}`);
    }

}
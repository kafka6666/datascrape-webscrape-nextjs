"use server";

import {scrapeUrlData} from "@/lib/scraper";
import {connectToDb} from "@/lib/mongoose";
import {Product, ProductDocument} from "@/lib/models/product.model";
import {getAveragePrice, getHighestPrice, getLowestPrice} from "@/lib/utils";
import {revalidatePath} from "next/cache";

export const scrapeAndStoreData = async (productUrl: string) => {
    if (!productUrl) return;

    try {
        // connect to database
        await connectToDb();
        const scrapedData = await scrapeUrlData(productUrl);
        console.log(scrapedData);

        // if scraped data is undefined, return an error
        if (!scrapedData?.currentPrice) {
            return new Error('Current price is undefined');
        }

        let data = scrapedData

        const existingData = await Product.findOne({url: scrapedData?.url}) as ProductDocument;

        if (existingData) {
            const updatedPriceHistory = [
                ...existingData.priceHistory,
                {price: scrapedData.currentPrice, date: new Date()}
            ]

            data = {
                ...scrapedData,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory)
            }

            const newData = await Product.findOneAndUpdate(
                {url: scrapedData?.url},
                data,
                {upsert: true, new: true}
            )

            revalidatePath(`/products/${newData._id}`)

            console.log(newData);
            return newData;
        }

        if (!scrapedData) return;
        // return scrapedData;
    } catch (error) {
        throw new Error(`Failed to create/update data: ${error}`);
    }

}
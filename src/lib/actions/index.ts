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


        // if scraped data is undefined, return an error
        if (!scrapedData) return new Error('Scraped data is undefined');
        if (!scrapedData?.currentPrice) {
            return new Error('Current price is undefined');
        }

        let data = scrapedData

        const existingData = await Product.findOne({url: scrapedData.url}) as ProductDocument;
        console.log(existingData);

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
        }

        const newData = await Product.findOneAndUpdate(
            {url: scrapedData.url},
            data,
            {upsert: true, new: true}
        )

        revalidatePath(`/products/${newData._id}`)

        console.log(newData);
        // return newData;

    } catch (error) {
        throw new Error(`Failed to create/update data: ${error}`);
    }

}

export const getDataById = async (productId: string) => {
    try {
        await connectToDb();

        // find data by id
        const data = await Product.findOne({_id: productId});
        if (!data) return null;
        return data;
    } catch (error) {
        console.log(error);
        throw new Error(`Failed to get data: ${error}`);
    }
}

export const getAllData = async () => {
    try {
        await connectToDb();

        // find all data
        const data = await Product.find();
        if (!data) return null;
        return data;
    } catch (error) {
        console.log(error);
        throw new Error(`Failed to get all data: ${error}`);
    }
}

export const getSimilarData = async (productId: string) => {
    try {
        await connectToDb();

        // find data by id
        const currentData = await Product.findById(productId);
        if (!currentData) return null;

        return await Product.find({
            _id: {$ne: productId},
        }).limit(3);
    } catch (error) {
        console.log(error);
        throw new Error(`Failed to get the similar data: ${error}`);
    }
}
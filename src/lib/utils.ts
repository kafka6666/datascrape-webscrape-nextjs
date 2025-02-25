import * as cheerio from 'cheerio';
import { AxiosResponse } from "axios";
import { PriceHistoryItem } from "@/types";

interface TextElement {
  text: () => string;
}

// Extracts the price from a list of possible elements
export const extractPrice = (...elements: TextElement[]): string => {
  for (const element of elements) {
    const priceText = element.text().trim();

    if (priceText) {
      const cleanPrice = priceText.replace(/[^\d.]/g, '');

      let firstPrice: string | undefined;

      if (cleanPrice) {
        firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
      }

      return firstPrice || cleanPrice;
    }
  }

  return '';
};

// Extracts the currency symbol from an element
export const extractCurrency = (element: TextElement): string => {
  const currencyText = element.text().trim().slice(0, 1);
  return currencyText ? currencyText : '';
};

// Extracts description from two possible elements from the site
export const extractDescription = (response: AxiosResponse<string>): string => {
  const selectors = [
    ".a-unordered-list .a-list-item",
    ".a-expander-content p",
  ] as const;

  const $ = cheerio.load(response.data);

  for (const selector of selectors) {
    const elements = $(selector);

    if (elements.length > 0) {
      return elements
          .map((_, element) => $(element).text().trim())
          .get()
          .join("\n");

    }
  }

  return "";
};

export function getHighestPrice(priceList: PriceHistoryItem[]): number {
  let highestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price > highestPrice.price) {
      highestPrice = priceList[i];
    }
  }

  return highestPrice.price;
}

export function getLowestPrice(priceList: PriceHistoryItem[]): number {
  let lowestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price < lowestPrice.price) {
      lowestPrice = priceList[i];
    }
  }

  return lowestPrice.price;
}

export function getAveragePrice(priceList: PriceHistoryItem[]): number {
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
  return sumOfPrices / priceList.length || 0;
}

export const formatNumber = (num: number = 0): string => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
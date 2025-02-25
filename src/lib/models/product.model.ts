import {model, models, Schema, Document} from "mongoose";

export interface PriceHistory{
    price: number;
    date: Date;
}

export interface ProductDocument extends Document {
    url: string;
    priceHistory: PriceHistory[];
    lowestPrice: number;
    highestPrice: number;
    averagePrice: number;
}

const ProductSchema = new Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    currency: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    currentPrice: {
        type: Number,
        required: true
    },
    originalPrice: {
        type: Number,
        required: true
    },
    priceHistory: [
        {
            price: {type: Number, required: true},
            date: {type: Date, default: Date.now}
        }
    ],
    lowestPrice: {type: Number},
    highestPrice: {type: Number},
    averagePrice: {type: Number},
    discountRate: {type: Number},
    description: {type: String},
    category: {type: String},
    reviewsCount: {type: Number},
    isOutOfStock: {type: Boolean, default: false},
    users: [
        {
            email: {type: String, required: true}
        }], default: [],
}, {timestamps: true}
);

export const Product = models.Product || model('Product', ProductSchema)
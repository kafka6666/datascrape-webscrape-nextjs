import {getDataById, getSimilarData} from "@/lib/actions";
import {redirect} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {ProductType} from "@/types";
import {formatNumber} from "@/lib/utils";
import PriceInfoCard from "@/components/PriceInfoCard";
import ProductCard from "@/components/ProductCard";

type Props = {
    params: Promise<{ id: string }> | undefined
}

const ProductDetailsPage = async({ params }: Props) => {
    if (!params) {
        redirect('/404');
    }
    const { id } = await params;
    const dataFromDb: ProductType = await getDataById(id);
    if (!dataFromDb) {
        redirect('/404');
    }

    const similarData = await getSimilarData(id);
    if (!similarData) {
        redirect('/404');
    }

    return (
        <div className="product-container">
            <div className="flex gap-28 xl:flex-row flex-col">
                <div className="product-image">
                    <Image
                        src={dataFromDb.image}
                        alt={dataFromDb.title}
                        width={580}
                        height={580}/>
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
                        <div className="flex flex-col gap-3">
                            <p className="text-[28px] text-secondary font-semibold">
                                {dataFromDb.title}
                            </p>
                            <Link
                                href={dataFromDb.url}
                                target="_blank"
                                className="text-base text-black opacity-50">
                                See the data
                            </Link>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="product-hearts">
                                <Image
                                    src="/assets/icons/red-heart.svg"
                                    alt="heart"
                                    width={20}
                                    height={20}/>
                                <p className="text-base font-semibold text-[#D46F77]">
                                    {dataFromDb.reviewsCount}
                                </p>
                            </div>
                            <div className="p-2 bg-[#FFF0F0] rounded-10">
                                <Image
                                    src="/assets/icons/bookmark.svg"
                                    alt="bookmark"
                                    height={20}
                                    width={20}/>
                            </div>
                            <div className="p-2 bg-[#FFF0F0] rounded-10">
                                <Image
                                    src="/assets/icons/share.svg"
                                    alt="share"
                                    height={20}
                                    width={20}/>
                            </div>
                        </div>
                    </div>
                    <div className="product-info">
                        <div className="flex flex-col gap-2">
                            <p className="text-[34px] text-secondary font-bold">
                                {dataFromDb.currency} {formatNumber(dataFromDb.currentPrice)}
                            </p>
                            <p className="text-[21px] text-black opacity-50 line-through">
                                {dataFromDb.currency} {formatNumber(dataFromDb.originalPrice)}
                            </p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-3">
                                <div className="product-stars">
                                    <Image
                                        src="/assets/icons/star.svg"
                                        alt="star"
                                        height={16}
                                        width={16}/>
                                    <p className="text-sm text-orange-500 font-semibold">
                                        {dataFromDb.stars || "25"}
                                    </p>
                                </div>
                                <div className="product-reviews">
                                    <Image
                                        src="/assets/icons/comment.svg"
                                        alt="comment"
                                        height={16}
                                        width={16}/>
                                    <p className="text-sm text-secondary font-semibold">
                                        {dataFromDb.reviewsCount} Reviews
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-black opacity-50">
                                <span className="text-green-600 font-semibold">93% </span>
                                of buyers have recommended this!
                            </p>
                        </div>
                    </div>
                    <div className="my-7 flex flex-col gap-5">
                        <div className="flex gap-5 flex-wrap">
                            <PriceInfoCard
                                title="Current Price"
                                iconSrc="/assets/icons/price-tag.svg"
                                value={`${dataFromDb.currency} ${formatNumber(dataFromDb.currentPrice)}`}
                            />
                            <PriceInfoCard
                                title="Average Price"
                                iconSrc="/assets/icons/chart.svg"
                                value={`${dataFromDb.currency} ${formatNumber(dataFromDb.averagePrice)}`}
                            />
                            <PriceInfoCard
                                title="Highest Price"
                                iconSrc="/assets/icons/arrow-up.svg"
                                value={`${dataFromDb.currency} ${formatNumber(dataFromDb.highestPrice)}`}
                            />
                            <PriceInfoCard
                                title="Lowest Price"
                                iconSrc="/assets/icons/arrow-down.svg"
                                value={`${dataFromDb.currency} ${formatNumber(dataFromDb.lowestPrice)}`}
                            />
                        </div>
                </div>
                    Modal
            </div>
            </div>
            <div className="flex flex-col gap-16">
                <div className="flex flex-col gap-5">
                    <h3 className="text-2xl text-secondary font-semibold">
                        Product Description
                    </h3>

                    <div className="flex flex-col gap-4">
                        {dataFromDb?.description?.split('\n')}
                    </div>
                </div>

                <button className="btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]">
                    <Image
                        src="/assets/icons/bag.svg"
                        alt="check"
                        width={22}
                        height={22}
                    />

                    <Link href="/" className="text-base text-white">
                        Buy Now
                    </Link>
                </button>
            </div>
            {similarData?.length > 0 && (
                <div className="py-14 flex flex-col gap-2 w-full">
                    <p className="section-text">Similar Products</p>

                    <div className="flex flex-wrap gap-10 mt-7 w-full">
                        {similarData.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
export default ProductDetailsPage

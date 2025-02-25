import Image from "next/image";
import Searchbar from "@/components/Searchbar";
import HeroCarousel from "@/components/HeroCarousel";
import {getAllData} from "@/lib/actions";
import ProductCard from "@/components/ProductCard";
import ImageScraper from "@/components/ImageScraper";

export default async function Home() {

    const allData = await getAllData();

  return (
      <>
        <section className="px-6 md:px-20 py-24 border-2 border-red-500">
            <div className="flex max-xl:flex-col gap-16">
                <div className="flex flex-col justify-center">
                    <p className="small-text">Smart Data Scraping Starts Here
                    <Image
                        src="/assets/icons/arrow-right.svg"
                        alt="arrow-right"
                        width={16}
                        height={16}/>
                    </p>
                    <h1 className="head-text">
                        Unleash the power of<span className="text-primary"> DataScrape</span>
                    </h1>
                    <p className="mt-6 paragraph-text">
                        Powerful, self-serve product and growth analytics to help you convert, engage, and retain more.
                    </p>
                    <Searchbar />
                    <ImageScraper />
                </div>
                <HeroCarousel />
            </div>
        </section>
          <section className="trending-section">
              <h2 className="section-text">Trending</h2>
              <div className="flex flex-wrap gap-x-8 gap-y-16">
                  {allData?.map(product => (
                      <ProductCard key={product._id} product={product}/>
                  ))}
              </div>
          </section>
      </>
  );
}

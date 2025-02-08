"use client"
import {FormEvent, ChangeEvent, useState} from "react"
import {scrapeAndStoreData} from "@/lib/actions";


// check whether the url provided is valid
const isValidUrl = (url: string): boolean | undefined => {
   try {
       const parsedUrl = new URL(url) // this will throw an error if the url is invalid
       // console.log(parsedUrl)
       const hostname = parsedUrl.hostname

       // check if the hostname contains "https://", "www.", or ".com"
       return hostname.includes("https://") || hostname.includes("www.") ||
           hostname.endsWith(".com");



   } catch (error) {
       console.log(error)
       return false
   }
}

const Searchbar = () => {
    const [searchPrompt, setSearchPrompt] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // check if the url is valid
        const isValidLink = isValidUrl(searchPrompt)
        if (!isValidLink) alert('Please provide a valid URL link.')

        // scraping logic would run here
        try {
            setIsLoading(true)
            // scrape the product page
            const scrapedData = await scrapeAndStoreData(searchPrompt);
            console.log(scrapedData);

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (

        <form
            className="flex flex-wrap gap-4 mt-12"
            onSubmit={handleSubmit}>
            <input
                className="searchbar-input"
                type="text"
                placeholder="Enter Product Link Here"
                value={searchPrompt}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchPrompt(e.target.value)}/>
            <button
            className="searchbar-btn"
            type="submit"
            disabled={searchPrompt === ""}>
                {isLoading ? "Scraping..." : "Scrape"}
            </button>
        </form>
    )
}
export default Searchbar

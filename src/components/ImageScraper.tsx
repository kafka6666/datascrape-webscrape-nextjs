'use client';

import { useState, FormEvent } from 'react';

export default function ImageScraper() {
  const [url, setUrl] = useState('');
  const [selector, setSelector] = useState('');
  const [outputDir, setOutputDir] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('Scraping images...');

    try {
      const response = await fetch('/api/scrape-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          selector,
          outputDir,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape images');
      }

      setStatus(`Success! ${data.message}`);
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : 'Failed to scrape images'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Image Scraper</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Website URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">CSS Selector</label>
          <input
            type="text"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            placeholder=".product-image img"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Output Directory</label>
          <input
            type="text"
            value={outputDir}
            onChange={(e) => setOutputDir(e.target.value)}
            placeholder="scraped-images/products"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-2 text-white rounded ${
            isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isLoading ? 'Scraping...' : 'Scrape Images'}
        </button>
      </form>

      {status && (
        <div className={`mt-4 p-4 rounded ${
          status.startsWith('Error') ? 'bg-red-100' : 'bg-green-100'
        }`}>
          {status}
        </div>
      )}
    </div>
  );
}
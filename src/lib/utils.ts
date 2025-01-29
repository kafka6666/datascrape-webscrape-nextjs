interface PriceElement {
  text: () => string;
}

export const extractPrice = (...elements: PriceElement[]) => {
  for (const element of elements) {
    const priceText = element.text().trim();

    if (priceText) return priceText.replace(/[^0-9.]/g, '');

    return '';
  }
};

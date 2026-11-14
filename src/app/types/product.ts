export interface MarketPrice {
  name: string;
  price: number;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  emoji: string;

  category: string;
  categorySlug: string;

  unit: string;
  description: string;

  price: number;
  previousPrice: number;

  markets: MarketPrice[];
}
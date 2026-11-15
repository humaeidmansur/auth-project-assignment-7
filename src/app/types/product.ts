export interface MarketPrice {
  name: string;
  price: number;
}
export default interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  image: string;
  unit: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;

  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}
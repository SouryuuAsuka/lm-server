import { LangText } from "./langText.entity";

export type ProductType = {
  product_id: number;
  org_id?: number;
  name?: LangText[];
  about?: LangText[];
  price?: number;
  active?: boolean;
  cat_id?: number;
  picture?: number;
  created?: string | null;
  orders?: number;
  preparation_time?: string;
  sold?: number;
}
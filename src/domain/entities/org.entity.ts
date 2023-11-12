import { LangText, PaymentType, ProductType } from "./";

export type OrgType = {
  org_id: number;
  name?: LangText[];
  about?: LangText[];
  category?: number;
  avatar?: number;
  country?: string;
  city?: string | null;
  street?: string | null;
  house?: string | null;
  flat?: string | null;
  comission?: number;
  public?: boolean;
  owner?: number;
  products?: ProductType[];
  usd_total?: number;
  usd_reseived?: number;
  admins?: number[] | null;
  payments?: PaymentType[];
}
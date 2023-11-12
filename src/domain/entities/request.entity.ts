import { LangText } from "./langText.entity";

export type RequestType = {
  org_id: number;
  name?:LangText[];
  about?:LangText[];
  avatar?:number;
  category?:number;
  country?:string|null;
  city?: string|null;
  moderator_comment?: string|null;
  email? : string;
  surname?: string|null;
  firstname?: string|null;
  telegram?: boolean;
  tg_username?: string;
  app_id?: number;
}
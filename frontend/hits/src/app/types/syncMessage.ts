import { Hit } from "../models/hit";

export type SyncMessage =
  | { type: 'login'; token: string }
  | { type: 'logout' }
  | { type: 'token'; token: string }
  | { type: 'update-hits'; hits: Hit[] };

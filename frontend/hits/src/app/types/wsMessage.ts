export interface WsMessage {
  type: "sync_request" | "need_sync";
  entityId?: string;
}

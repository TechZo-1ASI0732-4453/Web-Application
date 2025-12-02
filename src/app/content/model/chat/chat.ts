export enum MessageType {
  TEXT = 'TEXT',
  LOCATION = 'LOCATION',
}

export interface ChatMessage {
  id?: string;
  senderId: string;
  receiverId: string;
  conversationId?: string;
  exchangeId?: string;
  content: string;
  type?: MessageType;
  latitude?: number;
  longitude?: number;
  locationLabel?: string;
  timestamp?: string;
}

export interface ActiveConversation {
  conversationId: string;
  peerId: string;
  lastMessage: string | null;
  updatedAt: string;
  unreadCount: number;
  exchangeId?: string | null;
}

export interface ConversationSummary {
  conversationId: string;
  senderId: string;
  receiverId: string;
  exchangeId?: string | null;
}

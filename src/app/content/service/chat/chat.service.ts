import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {environment} from "../../../../environments/environment";
import {ActiveConversation, ChatMessage, ConversationSummary} from "../../model/chat/chat";

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly apiUrl = `${environment.baseUrl}/api/v2/chat`;

  private readonly wsUrl = `${environment.baseUrl}/ws`;

  private stompClient?: Client;
  private stompConnected = false;

  private chatMessagesSubject = new Subject<ChatMessage>();
  private inboxUpdatesSubject = new Subject<ActiveConversation>();

  chatMessages$ = this.chatMessagesSubject.asObservable();
  inboxUpdates$ = this.inboxUpdatesSubject.asObservable();

  private pendingConversations = new Set<string>();
  private subscribedConversations = new Set<string>();

  constructor(private http: HttpClient) {}

  getMessages(conversationId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(
      `${this.apiUrl}/messages/${conversationId}`
    );
  }

  openConversation(
    conversationId?: string,
    exchangeId?: string
  ): Observable<string> {
    let params = new HttpParams();
    if (conversationId) {
      params = params.set('conversationId', conversationId);
    }
    if (exchangeId) {
      params = params.set('exchangeId', exchangeId);
    }

    return this.http.post(`${this.apiUrl}/conversations/open`, null, {
      params,
      responseType: 'text',
    });
  }

  closeConversation(conversationId: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/conversations/${conversationId}/close`,
      {}
    );
  }

  getConversationStatus(conversationId: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/conversations/${conversationId}/status`, {
      responseType: 'text',
    });
  }

  listAllConversations(): Observable<ConversationSummary[]> {
    return this.http.get<ConversationSummary[]>(`${this.apiUrl}/conversations`);
  }

  getActiveConversations(userId: string): Observable<ActiveConversation[]> {
    return this.http.get<ActiveConversation[]>(`${this.apiUrl}/active/${userId}`);
  }

  markAsRead(userId: string, conversationId: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/read/${userId}/${conversationId}`,
      {}
    );
  }

  private subscribeInternal(conversationId: string): void {
    if (!this.stompClient) return;


    this.stompClient.subscribe(`/topic/chat.${conversationId}`, (msg: IMessage) => {
      const body: ChatMessage = JSON.parse(msg.body);
      this.chatMessagesSubject.next(body);
    });

    this.subscribedConversations.add(conversationId);
  }


  connect(userId: string): void {
    if (this.stompConnected && this.stompClient) {
      return;
    }

    const SockJsImpl: any = (SockJS as any).default || SockJS;
    const socket = new SockJsImpl(this.wsUrl);

    this.stompClient = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      debug: (msg) => console.log('[STOMP DEBUG]', msg),
    });

    this.stompClient.onConnect = (frame) => {
      this.stompConnected = true;

      this.pendingConversations.forEach(cid => {
        this.subscribeInternal(cid);
      });
      this.pendingConversations.clear();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('[ChatService] STOMP error:', frame);
    };

    this.stompClient.onWebSocketError = (event) => {
      console.error('[ChatService] WebSocket error:', event);
    };

    this.stompClient.activate();
  }

  subscribeToConversation(conversationId: string): void {

    if (this.subscribedConversations.has(conversationId) ||
      this.pendingConversations.has(conversationId)) {
      return;
    }

    if (!this.stompClient || !this.stompConnected) {
      this.pendingConversations.add(conversationId);
      return;
    }

    this.subscribeInternal(conversationId);
  }

  sendChatMessage(message: ChatMessage): void {
    if (!this.stompClient || !this.stompConnected) {
      console.warn('No hay conexión STOMP activa');
      return;
    }

    this.stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(message),
    });

  }

  disconnect(): void {
    if (this.stompClient && this.stompConnected) {
      this.stompClient.deactivate();
      this.stompConnected = false;
    }
  }
}

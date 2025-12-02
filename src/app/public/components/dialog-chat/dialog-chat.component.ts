import {
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ChatService} from "../../../content/service/chat/chat.service";
import {ChatMessage, MessageType} from "../../../content/model/chat/chat";
import {environment} from "../../../../environments/environment";

interface UiMessage {
  fromMe: boolean;
  text?: string;
  imageUrl?: string;
  isLocation?: boolean;
  mapsLink?: string;
}


export interface DialogChatData {
  name: string;
  profilePicture: string;
  myUserId: number;
  peerId: number;
  conversationId: string;
  exchangeId: number;
}

@Component({
  selector: 'app-dialog-chat',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatIcon,
    FormsModule,
    MatIconButton,
    NgClass,
    NgForOf,
    NgIf
  ],
  templateUrl: './dialog-chat.component.html',
  styleUrls: ['./dialog-chat.component.css']
})
export class DialogChatComponent implements OnInit, AfterViewInit {

  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogChatData,
    private chatService: ChatService
  ) {}

  messages: UiMessage[] = [];
  newMessage = '';

  ngOnInit() {
    const myId = this.data.myUserId.toString();
    const convId = this.data.exchangeId.toString(); // conversationId = exchangeId

    this.chatService.connect(myId);

    this.chatService.getMessages(convId)
      .subscribe((msgs: ChatMessage[]) => {
        this.messages = msgs.map(m => this.mapToUiMessage(m));
        setTimeout(() => this.scrollToBottom(), 0);
      });

    this.chatService.subscribeToConversation(convId);

    this.chatService.chatMessages$
      .subscribe((msg: ChatMessage) => {

        if (msg.conversationId !== convId) return;

        if (msg.senderId === myId) {
          return;
        }

        this.messages.push(this.mapToUiMessage(msg));
        setTimeout(() => this.scrollToBottom(), 0);
      });
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  private mapToUiMessage(msg: ChatMessage): UiMessage {
    const myId = this.data.myUserId.toString();
    const fromMe = msg.senderId === myId;

    if (msg.type === MessageType.LOCATION && msg.latitude != null && msg.longitude != null) {
      const lat = msg.latitude;
      const lng = msg.longitude;

      const mapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

      const staticMapUrl =
        `https://maps.googleapis.com/maps/api/staticmap` +
        `?center=${lat},${lng}` +
        `&zoom=16&size=300x200&markers=color:red%7C${lat},${lng}` +
        `&key=${environment.googleMapsApiKey}`;

      return {
        fromMe,
        isLocation: true,
        text: msg.locationLabel || 'Ubicación',
        imageUrl: staticMapUrl,
        mapsLink
      };
    }

    return {
      fromMe,
      text: msg.content,
    };
  }



  sendMessage() {
    const trimmed = this.newMessage.trim();
    if (!trimmed) return;

    const peerId = this.data.peerId.toString();
    const convId = this.data.exchangeId.toString(); // conversationId = exchangeId
    const myId = this.data.myUserId.toString();

    const backendMsg: ChatMessage = {
      senderId: myId,
      receiverId: peerId,
      conversationId: convId,
      exchangeId: convId,
      content: trimmed,
      type: MessageType.TEXT
    };


    this.chatService.sendChatMessage(backendMsg);

    this.messages.push({
      fromMe: true,
      text: trimmed
    });

    this.newMessage = '';
    setTimeout(() => this.scrollToBottom(), 0);
  }

  openMaps(url?: string, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (!url) return;
    window.open(url, '_blank');
  }

  sendLocation() {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const myId = this.data.myUserId.toString();
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const peerId = this.data.peerId.toString();
        const convId = this.data.exchangeId.toString();

        const backendMsg: ChatMessage = {
          senderId: myId,
          receiverId: peerId,
          conversationId: convId,
          exchangeId: convId,
          content: '',
          type: MessageType.LOCATION,
          latitude: lat,
          longitude: lng,
          locationLabel: 'Mi ubicación'
        };


        this.chatService.sendChatMessage(backendMsg);

        this.messages.push(this.mapToUiMessage(backendMsg));
        setTimeout(() => this.scrollToBottom(), 0);
      },
      (error) => {
        console.error('Error obteniendo ubicación', error);
        alert('No se pudo obtener tu ubicación. Revisa los permisos del navegador.');
      }
    );
  }


  private scrollToBottom() {
    if (!this.messagesContainer) return;
    const el = this.messagesContainer.nativeElement;
    el.scrollTop = el.scrollHeight;
  }
}

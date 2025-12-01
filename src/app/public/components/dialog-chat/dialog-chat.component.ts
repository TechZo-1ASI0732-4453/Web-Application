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

interface ChatMessage {
  fromMe: boolean;
  text?: string;
  imageUrl?: string;
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

  // 👇 referencia al contenedor de mensajes
  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  messages: ChatMessage[] = [
    { fromMe: false, text: 'Camiseta oficial del FC Barcelona...' },
    { fromMe: true, text: 'No gracias' },
    { fromMe: true, imageUrl: 'ruta/al/mapa.png' }
  ];

  newMessage = '';

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.messages.push({
      fromMe: true,
      text: this.newMessage
    });

    this.newMessage = '';

    // 👇 después de añadir el mensaje, baja el scroll
    setTimeout(() => this.scrollToBottom(), 0);
  }

  private scrollToBottom() {
    if (!this.messagesContainer) return;

    const el = this.messagesContainer.nativeElement;
    el.scrollTop = el.scrollHeight;
  }
}

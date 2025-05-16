import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-message-box-component',
  standalone: true,
  imports: [],
  templateUrl: './message-box-component.component.html',
  styleUrl: './message-box-component.component.css'
})
export class MessageBoxComponentComponent {
  @Input() message: string = 'No se encontraron resultados.';
}

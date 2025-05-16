import {Component} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-delete-post',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIcon,
    MatDialogModule
  ],
  templateUrl: './dialog-delete-post.component.html',
  styleUrl: './dialog-delete-post.component.css'
})
export class DialogDeletePostComponent {
  constructor() {}
}

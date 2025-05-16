import { Component } from '@angular/core';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {DialogRef} from "@angular/cdk/dialog";
import {MatIcon} from "@angular/material/icon";
import {MatFormField} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatLabel} from "@angular/material/form-field";

@Component({
  selector: 'app-dialog-edit-post',
  standalone: true,
  imports: [
    MatDialogModule, MatButtonModule, RouterLink, MatIcon, MatFormField, MatSelect, MatOption, MatLabel
  ],
  templateUrl: './dialog-edit-post.component.html',
  styleUrl: './dialog-edit-post.component.css'
})
export class DialogEditPostComponent {
  constructor(private dialogRef: DialogRef<DialogEditPostComponent>,private router: Router) {}
}

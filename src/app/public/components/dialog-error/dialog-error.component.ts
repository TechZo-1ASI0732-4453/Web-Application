import { Component } from '@angular/core';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {DialogRef} from "@angular/cdk/dialog";
import {MatIcon} from "@angular/material/icon";
import {MatFormField} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatLabel} from "@angular/material/form-field";
import {Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-error',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, RouterLink, MatIcon, MatFormField, MatSelect, MatOption, MatLabel],
  templateUrl: './dialog-error.component.html',
  styleUrl: './dialog-error.component.css'
})
export class DialogErrorComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
       private dialogRef: DialogRef<DialogErrorComponent>,
       private router: Router) {}
  
}

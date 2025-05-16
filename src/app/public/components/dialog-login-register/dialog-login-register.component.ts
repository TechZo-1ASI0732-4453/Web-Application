import { Component } from '@angular/core';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {DialogRef} from "@angular/cdk/dialog";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-dialog-login-register',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, RouterLink, MatIcon],
  templateUrl: './dialog-login-register.component.html',
  styleUrl: './dialog-login-register.component.css'
})
export class DialogLoginRegisterComponent {
    constructor(private dialogRef: DialogRef<DialogLoginRegisterComponent>,private router: Router) {}

  onLogin(){
    this.router.navigateByUrl('/login')
    this.dialogRef.close();
  }

  onRegister(){
      this.router.navigateByUrl('/register')
    this.dialogRef.close();
  }

}

import {Component, Inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {NgxDropzoneModule} from "ngx-dropzone";
import {UsersService} from "../../../content/service/users/users.service";
import {FirebaseStorageService} from "../../../content/service/firebase-storage/firebase-storage";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-dialog-change-profile',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatIcon,
    RouterLink,
    NgForOf,
    NgIf,
    NgxDropzoneModule
  ],
  templateUrl: './dialog-change-profile.component.html',
  styleUrl: './dialog-change-profile.component.css'
})
export class DialogChangeProfileComponent {

  files: File[] = [];
  disableButton = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private usersService: UsersService,
              private storageService: FirebaseStorageService,
              private dialogRef: MatDialogRef<DialogChangeProfileComponent>){ }

  async onChange() {
    if (!this.files.length) return;
    const userId = Number(this.data);
    const user = await lastValueFrom(
      this.usersService.getUserById(userId)
    );
    const file = this.files[0];
    const { progress$, url$ } = this.storageService.uploadProfileImage(
      file,
      userId.toString()
    );
    progress$.subscribe();
    const profileUrl = await lastValueFrom(url$);

    const changeImage = {
      id: user.id,
      name: user.name,
      username: user.username,
      phoneNumber: user.phoneNumber,
      profilePicture: profileUrl
    };
    await lastValueFrom(
      this.usersService.changeProfileImage(userId, changeImage)
    );

    this.dialogRef.close(true);
  }


  onSelect(event:any) {
    this.disableButton = false;
    if (this.files.length) this.files.splice(this.files.indexOf(event), 1);
    this.files.push(event.addedFiles[0]);
  }

  onRemove(event:any) {
    this.disableButton = true;
    this.files.splice(this.files.indexOf(event), 1);
  }


}

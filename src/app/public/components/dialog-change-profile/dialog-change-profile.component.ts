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
  profileUrl: string = '';
  disableButton = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private usersService: UsersService,
              private dialogRef: MatDialogRef<DialogChangeProfileComponent>){ }

  onChange(){
    this.usersService.getUserById(Number(this.data)).subscribe(user => {
      this.changeImageProfile().then((url) => {
        if (url.length) {
          const changeImage = {
            id: user.id,
            name: user.name,
            username: user.username,
            phoneNumber: user.phoneNumber,
            profilePicture: url,
          };

          this.usersService.changeProfileImage(Number(user.id), changeImage).subscribe(() => {
            this.dialogRef.close();
          });
        }
      });
    });
  }

  async changeImageProfile(){
    const api = "https://api.imgbb.com/1/upload?expiration=300&key=e20a8b081ea288c51254cd9dca20515c&name="
    for (let file of this.files){
      const url = api + file.name
      const data = new FormData();
      data?.append('image', file);

      try {
        const response = await fetch(url, {method: 'post',body: data});
        const responseData = await response.json();
        this.profileUrl = responseData.data.url;
      } catch (error) {
        console.error(error);
      }
    }
    return this.profileUrl
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

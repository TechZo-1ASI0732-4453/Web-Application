import {Component, inject, OnInit} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from "@angular/material/icon";
import { UsersService } from "../../service/users/users.service";
import { NgForOf, NgIf } from "@angular/common";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatIconButton } from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { DialogDeletePostFavoritesComponent } from "../../../public/components/dialog-delete-post-favorites/dialog-delete-post-favorites.component";
import {MessageBoxComponentComponent} from "../message-box-component/message-box-component.component";

@Component({
  selector: 'app-my-favorites',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    NgForOf,
    NgIf,
    MatMenuModule,
    MatIconModule,
    MatIconButton,
    MatButtonModule,
    RouterLink,
    MessageBoxComponentComponent
  ],
  templateUrl: './my-favorites.component.html',
  styleUrls: ['./my-favorites.component.css']
})
export class MyFavoritesComponent implements OnInit {
  favorites: any[] = [];
  checked = false;

  constructor(
    private userService: UsersService,
    private dialogDeletePostFavorites: MatDialog
  ) { }

  ngOnInit() {
    this.getFavorites();
  }

  getFavorites() {
    const userId = localStorage.getItem('id');
    if (!userId) return;

    this.userService.getFavoritesProducts(userId).subscribe(favorites => {
      this.favorites = favorites.map(fav => ({
        product: fav.product,
        id: fav.id
      }));
    this.checked = true;
    }, error => {
      console.error('Error fetching favorites:', error);
     this.checked = true;
    });
  }

  openConfirm(id: number) {
    const userId = localStorage.getItem('id')||'0';
    const favIdEliminate = this.favorites.find(fav => fav.product.id === id).id;
    const dialogRef = this.dialogDeletePostFavorites.open(DialogDeletePostFavoritesComponent, { disableClose: true, data: id });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteFavoriteProduct(userId,id.toString()).subscribe(() => {
         this.favorites = this.favorites.filter(fav =>{
           return fav.id !== favIdEliminate
         });
          console.log('Favorite deleted successfully.');
        }, error => {
          console.error('Error deleting favorite:', error);
        });
      }
    });
  }
}

import {Component, EventEmitter, Output} from '@angular/core';
import {MatAnchor, MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {UserSentOffersComponent} from "../user-sent-offers/user-sent-offers.component";
import {UserGetOffersComponent} from "../user-get-offers/user-get-offers.component";
import {NgIf} from "@angular/common";
import {MessageBoxComponentComponent} from "../message-box-component/message-box-component.component";

@Component({
  selector: 'app-user-offers',
  standalone: true,
  imports: [
    MatButton,
    MatAnchor,
    RouterLink,
    UserSentOffersComponent,
    UserGetOffersComponent,
    NgIf,
    MessageBoxComponentComponent
  ],
  templateUrl: './user-offers.component.html',
  styleUrl: './user-offers.component.css'
})
export class UserOffersComponent {

  showSent: boolean = true;

  sentOffersEmpty = false;
  getOffersEmpty  = false;

  sentChecked = false;
  getChecked  = false;

  showSentOffers() {
    this.showSent = true;
  }

  showGetOffers() {
    this.showSent = false;
  }

  onSentOffersChecked(isEmpty: boolean) {
    this.sentOffersEmpty = isEmpty;
    this.sentChecked = true;
  }

  onGetOffersChecked(isEmpty: boolean) {
    this.getOffersEmpty = isEmpty;
    this.getChecked = true;
  }
}


import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule} from "@angular/material/icon";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import { ReactiveFormsModule} from "@angular/forms";
import {FormsModule} from "@angular/forms";
import {MessageBoxComponentComponent} from "../message-box-component/message-box-component.component";
import {UserGetOffersComponent} from "../user-get-offers/user-get-offers.component";
import {UserSentOffersComponent} from "../user-sent-offers/user-sent-offers.component";
import {CompleteExchangesComponent} from "../complete-exchanges/complete-exchanges.component";
import {PendingExchangesComponent} from "../pending-exchanges/pending-exchanges.component";

@Component({
  selector: 'app-exchanges',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    NgForOf,
    NgIf,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    MessageBoxComponentComponent,
    UserGetOffersComponent,
    UserSentOffersComponent,
    CompleteExchangesComponent,
    PendingExchangesComponent
  ],
  templateUrl: './exchanges.component.html',
  styleUrl: './exchanges.component.css'
})
export class ExchangesComponent {

  showSent: boolean = true;

  pendingExchangesEmpty = false;
  completedExchangesEmpty  = false;

  pendingChecked = false;
  completedChecked  = false;

  showPendingExchanges() {
    this.showSent = true;
  }

  showCompleteExchanges() {
    this.showSent = false;
  }

  onPendingExchangesChecked(isEmpty: boolean) {
    this.pendingExchangesEmpty = isEmpty;
    this.pendingChecked = true;
  }

  onCompletedExchangesChecked(isEmpty: boolean) {
    this.completedExchangesEmpty = isEmpty;
    this.completedChecked = true;
  }
}

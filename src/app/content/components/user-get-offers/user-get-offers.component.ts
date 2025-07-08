import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { OffersService } from "../../service/offers/offers.service";
import { DialogDeniedOfferComponent } from "../../../public/components/dialog-denied-offer/dialog-denied-offer.component";
import { DialogSuccessfulExchangeComponent } from "../../../public/components/dialog-successful-exchange/dialog-successful-exchange.component";
import {MatCard, MatCardAvatar, MatCardContent, MatCardFooter, MatCardHeader} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {NgForOf} from "@angular/common";
import {CambiazoStateService} from "../../states/cambiazo-state.service";
import {EmailjsService} from "../../service/emailjs/emailjs.service";

@Component({
  selector: 'app-user-get-offers',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardFooter,
    MatIcon,
    NgForOf,
    MatCardAvatar
  ],
  templateUrl: './user-get-offers.component.html',
  styleUrl: './user-get-offers.component.css'
})
export class UserGetOffersComponent implements OnInit {
  @Output() checkEmpty = new EventEmitter<boolean>();
  offers: any[] = [];
  private readonly cambiazoState: CambiazoStateService = inject(CambiazoStateService);
  districts = this.cambiazoState.districts;

  constructor(
    private offersService: OffersService,
    private dialog: MatDialog,
    private emailjsService: EmailjsService,
  ) {}

  ngOnInit() {
    this.getAllOffers();
  }

  getAllOffers(): void {
    const userId = localStorage.getItem('id');
    if (!userId) return;

    this.offersService.getAllOffersByUserChangeId(userId).subscribe((data: any[]) => {
      const filtered = data.filter((offer: any) => offer.status === 'Pendiente');
      this.checkEmpty.emit(filtered.length === 0);
      this.offers = filtered.map((offer:any) => ({
        ...offer,
        districtName: this.districts().find(d => d.id === offer.productOwn.districtId)?.name,
      }));
    });
  }

  setStatusAccepted(offer: any) {
    const offerId = offer.id;
    this.offersService.updateOfferStatus(offer.id.toString(), 'Aceptado').subscribe(() => {
      this.sendNotification('ACEPTADA', offer.userOwn.name, offer.productOwn.name, offer.userOwn.email)
      this.offers = this.offers.filter(o => o.id !== offerId);
      if (offer) {
        this.dialog.open(DialogSuccessfulExchangeComponent, {
          data: {
            name: offer.userOwn.name,
            profilePicture: offer.userOwn.profilePicture,
            phone: offer.userOwn.phoneNumber,
            username: offer.userOwn.username
          },
          disableClose: true
        });
      }
    });
  }

  setStatusDenied(offer: any) {
    const offerId = offer.id;
    const dialogRef = this.dialog.open(DialogDeniedOfferComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.offersService.updateOfferStatus(offerId.toString(), 'Denegado').subscribe(() => {
          this.sendNotification('RECHAZADA', offer.userOwn.name, offer.productOwn.name, offer.userOwn.email)
          this.offers = this.offers.filter(o => o.id !== offerId);
        });
      }
    });
  }

  sendNotification(status: string,name:string,productName:string,email:string): void {
    this.emailjsService.sendNotification(
      status,
      name,
      productName,
      email,
    ).subscribe({ 
      next: (response) => {
        console.log('Email enviado con éxito:', response);
      },
      error: (error) => {
        console.error('Error al enviar el correo electrónico:', error);
        console.error('status', status);
        console.error('name', name); 
        console.error('productName', productName);
        console.error('email', email);
      }
    });
  }

  



  
}

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {DialogRef} from "@angular/cdk/dialog";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-dialog-successful-exchange',
  standalone: true,
    imports: [
      MatDialogModule, MatButtonModule, RouterLink, MatIcon
    ],
  templateUrl: './dialog-successful-exchange.component.html',
  styleUrl: './dialog-successful-exchange.component.css'
})
export class DialogSuccessfulExchangeComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
  }
  sendWhatsapp() {
    const phone = this.data.phone;
    const message = encodeURIComponent("Hola, soy el usuario de CambiaZo con el que hiciste el intercambio. ¿Cuándo podríamos hacer la entrega?");
    const whatsappLink = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappLink, "_blank");

    console.log(whatsappLink);
  }

   sendEmail() {
    const email = this.data.username;
    const subject = "Intercambio en CambiaZo";
    const body = encodeURIComponent("Hola, soy el usuario de CambiaZo con el que hiciste el intercambio. ¿Cuándo podríamos hacer la entrega?");
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    console.log(mailtoLink);
  }
}

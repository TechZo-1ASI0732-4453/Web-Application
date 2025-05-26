import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent
} from '@angular/material/dialog';
import {
  MembershipsService,
} from '../../service/memberships/memberships.service';
import { switchMap } from 'rxjs/operators';
import {CreateInvoicePayload, InvoiceResource, InvoiceService} from "../../service/invoice/invoice.service";
declare const paypal: any;

export interface DialogData {
  id: string;
  name: string;
  price: number;
  planId: number;
  userId: number;
  subscriptionId: number;
}

export interface DialogResult {
  subscriptionUpdated: boolean;
  invoice?: InvoiceResource;
}

@Component({
  selector: 'app-dialog-paypal',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent],
  templateUrl: './dialog-paypal.component.html',
  styleUrl:   './dialog-paypal.component.css'
})
export class DialogPaypalComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DialogPaypalComponent, DialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private membershipsService: MembershipsService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    const target = `paypal-button-container-${this.data.id}`;
    setTimeout(() => {
      document.getElementById(target)!.innerHTML = '';

      paypal.Buttons({

        createOrder: (_: any, actions: any) =>
          actions.order.create({
            purchase_units: [{
              amount:      { value: this.data.price.toString() },
              description: `Membresía ${this.data.name}`
            }]
          }),

        onApprove: (_: any, actions: any) =>
          actions.order.capture().then(() => {

            const subBody = {
              state:  'Activo',
              planId: this.data.planId,
              userId: this.data.userId
            };

            this.membershipsService.putSubscriptionStatus(
              this.data.subscriptionId,
              subBody
            )

              .pipe(
                switchMap(() => {
                  const payload: CreateInvoicePayload = {
                    totalAmount: this.data.price,
                    concept:     this.data.name,
                    userId:      this.data.userId
                  };
                  return this.invoiceService.createInvoice(payload);
                })
              )

              .subscribe({
                next:  invoice => this.dialogRef.close({ subscriptionUpdated: true, invoice }),
                error: err => {
                  console.error('Error generando boleta:', err);
                  this.dialogRef.close({ subscriptionUpdated: true });
                }
              });

          }),

        onError: (err: any) => {
          console.error('PayPal Error:', err);
          this.dialogRef.close({ subscriptionUpdated: false });
        }

      }).render('#' + target);
    }, 0);
  }
}

import { Component, OnInit } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { MembershipsService } from "../../service/memberships/memberships.service";
import { Memberships } from "../../model/memberships/memberships.model";
import { UsersService } from "../../service/users/users.service";
import { DialogLoginRegisterComponent } from "../../../public/components/dialog-login-register/dialog-login-register.component";
import { MatDialog } from "@angular/material/dialog";
import { Router } from '@angular/router';
import {forkJoin, throwIfEmpty} from "rxjs";
import { Users } from "../../model/users/users.model";
import {DialogPaypalComponent} from "../../components/dialog-paypal/dialog-paypal.component";
import {
  DialogCancelMembershipComponent
} from "../../components/dialog-cancel-membership/dialog-cancel-membership.component";

declare var paypal: any;

@Component({
  selector: 'app-memberships',
  standalone: true,
  imports: [
    MatCardModule,
    NgForOf,
    NgClass,
    NgIf
  ],
  templateUrl: './memberships.component.html',
  styleUrls: ['./memberships.component.css']
})

export class MembershipsComponent implements OnInit {
  memberships: Memberships[] = [];
  membershipCurrent: any;
  user: Users | null = null;
  isLoggedIn: boolean = false;
  showPayPalFor: string | null = null;
  dataLoaded: boolean = false;
  loading: boolean = true;

  constructor(
    private membershipsService: MembershipsService,
    private userService: UsersService,
    private dialogLoginRegister: MatDialog,
    private router: Router,
    private dialog: MatDialog,


) {}

  ngOnInit() {
    this.getUser();
    this.loadMemberships();
    this.getMembershipCurrent();
    this.isLoggedIn = this.userService.isLogged;
    const userId = localStorage.getItem('id');

    const calls: any = {
      allPlans: this.membershipsService.getMemberships()
    };

    if (userId) {
      calls.currentPlan = this.membershipsService.getUserMembership(userId);
      calls.userData    = this.userService.getUserById(+userId);
    }

    forkJoin(calls).subscribe(
      (result: any) => {
        this.memberships = result.allPlans;
        if (result.currentPlan) this.membershipCurrent = result.currentPlan;
        if (result.userData)    this.user = result.userData;
        this.dataLoaded = true;
      },
      err => console.error('Error loading data', err)
    );
  }

  getMembershipCurrent() {
    const userId = localStorage.getItem('id');
    if (userId) {
      this.membershipsService.getUserMembership(userId).subscribe((data) => {
        this.membershipCurrent = { ...data };
      });
    }
  }

  getUser() {
    const userId = Number(localStorage.getItem('id'));
    if (userId) {
      this.userService.getUserById(userId).subscribe((data) => {
        this.user = data;
        this.loadMemberships();
      });
    }
  }

  loadMemberships(): void {
    this.membershipsService.getMemberships().subscribe(
      (memberships) => {
        this.memberships = memberships;
      },
      (error) => {
        console.error('Error loading memberships:', error);
      }
    );
  }

  filterMemberships() {
    if (this.isLoggedIn && this.user) {
      this.memberships = this.memberships.filter(
        m => m.id.toString() !== this.user!.membership && Number(m.id) !== 1
      );
    }
  }

  onBuyPlan(membershipId: string) {
    if (!this.isLoggedIn) {
      this.dialogLoginRegister.open(DialogLoginRegisterComponent, { disableClose: true });
    } else {
      const selected = this.memberships.find(m => m.id.toString() === membershipId);
      if (!selected || !this.user) return;

      const subscriptionPayload = {
        state: 'Activo',
        planId: selected.id,
        userId: this.user.id
      };

      this.membershipsService.createSubscription(subscriptionPayload).subscribe({
        next: (response) => {
          this.dialogLoginRegister.open(DialogPaypalComponent, {
            data: {
              id: selected.id,
              name: selected.name,
              price: selected.price,
              planId: selected.id,
              userId: this.user!.id,
              subscriptionId: response.id
            },
            width: '400px',
            disableClose: false
          })
            .afterClosed()
            .subscribe(result => {
              if (result?.subscriptionUpdated && selected) {
                this.membershipCurrent = { ...this.membershipCurrent, plan: { ...selected } };
              }
            });
        },
        error: (error) => {
          console.error('Error creating subscription:', error);
        }
      });
    }
  }

  cancelSubscription(): void {
    const ref = this.dialog.open(DialogCancelMembershipComponent, {
      width: '400px',
      disableClose: true
    });
    ref.afterClosed().subscribe(result => {
      if (result !== 'confirm' || !this.user) return;
      this.membershipsService
        .createSubscription({ userId: this.user.id, planId: 1, state: 'Activo' })
        .subscribe(() => this.getMembershipCurrent());
    });
  }


  protected readonly throwIfEmpty = throwIfEmpty;
}

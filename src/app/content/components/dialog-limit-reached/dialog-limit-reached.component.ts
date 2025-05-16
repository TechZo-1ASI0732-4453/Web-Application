import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-limit-reached',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './dialog-limit-reached.component.html',
  styleUrls: ['./dialog-limit-reached.component.css']
})
export class DialogLimitReachedComponent {
  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<DialogLimitReachedComponent>
  ) {}

  upgradePlan(): void {
    this.dialogRef.close();
    this.router.navigateByUrl('/memberships');
  }
}

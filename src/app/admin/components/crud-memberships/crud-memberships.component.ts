import { Component, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { MembershipsService } from "../../../content/service/memberships/memberships.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-crud-memberships',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './crud-memberships.component.html',
  styleUrls: ['./crud-memberships.component.css']
})
export class CrudMembershipsComponent implements OnInit {
  dataSource = new MatTableDataSource();
  displayedColumns = ['id', 'name', 'price', 'description', 'benefits', 'actions'];

  constructor(private membershipService: MembershipsService, private dialogMembership: MatDialog) {}

  ngOnInit() {
    this.getAllMembership();
  }

  getAllMembership() {
    this.membershipService.getMemberships().subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res);
    });
  }

  deleteMembership(id: string) {
    this.membershipService.deleteMembership(id).subscribe(() => {
      this.getAllMembership(); // Refresh the list after deletion
    });
  }

  editMembership(id: string) {
    // this.dialogMembership.open(DialogOngsCategoriesComponent, { data: id });
  }

  addMembership() {
    // this.dialogMembership.open(DialogOngsCategoriesComponent);
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent2 implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent2>) { }

  ngOnInit(): void {
  }

}

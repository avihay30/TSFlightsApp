import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Flight } from 'src/app/model/flight.model';

@Component({
  selector: 'app-flight-edit-dialog',
  templateUrl: './flight-edit-dialog.component.html',
  styleUrls: ['./flight-edit-dialog.component.scss'],
})
export class FlightEditDialogComponent implements OnInit {
  dialogTitle = "Update a Flight"

  constructor(
    public dialogRef: MatDialogRef<FlightEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public flight: Flight,
  ) {}

  ngOnInit(): void {}

  submit(editedFlight: Flight): void {
    this.dialogRef.close(editedFlight);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

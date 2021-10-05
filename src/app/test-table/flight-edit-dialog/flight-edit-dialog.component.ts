import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Flight } from 'src/app/model/flight.model';

@Component({
  selector: 'app-flight-edit-dialog',
  templateUrl: './flight-edit-dialog.component.html',
  styleUrls: ['./flight-edit-dialog.component.scss'],
})
export class FlightEditDialogComponent implements OnInit {
  newFlight: Flight;
  dateRange: FormGroup;

  @ViewChild('originInput') originInput!: ElementRef;
  @ViewChild('destinationInput') destinationInput!: ElementRef;
  @ViewChild('flightNumInput') flightNumInput!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<FlightEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public flight: Flight,
  ) {
    this.newFlight = flight;
    this.dateRange = new FormGroup({
      depart: new FormControl(new Date(this.newFlight.depart)),
      arrive: new FormControl(new Date(this.newFlight.arrive)),
    });
  }

  ngOnInit(): void {}

  onYesClick(): void {
    this.newFlight.origin = this.originInput.nativeElement.value;
    this.newFlight.destination = this.destinationInput.nativeElement.value;
    this.newFlight.flightNumber = this.flightNumInput.nativeElement.value;
    this.newFlight.depart = this.dateRange.value.depart;
    this.newFlight.arrive = this.dateRange.value.arrive;

    this.flight = this.newFlight;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // TODO: fix checkbox
  toggleNonStop() {
    this.newFlight.isNonstop = !this.newFlight.isNonstop;
  }
}

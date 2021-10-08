import { formatDate } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { Flight } from 'src/app/model/flight.model';
import { FlightsService } from 'src/app/services/flights.service';
import { PICK_FORMATS } from '../flight-edit-dialog/flight-edit-dialog.component';

@Injectable()
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd/MM/yy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-flight-create-form',
  templateUrl: './flight-create-form.component.html',
  styleUrls: ['./flight-create-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
  ],
})
export class FlightCreateFormComponent implements OnInit {
  formIsValid = true;
  emptyFlight: Flight = {
    origin: '',
    destination: '',
    flightNumber: 0,
    depart: new Date(),
    arrive: new Date(new Date().setDate(new Date().getDate() + 3)),
    isNonstop: false,
  };
  flightCreateForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private flightsService: FlightsService) {
    this.flightCreateForm = this.formBuilder.group({ ...this.emptyFlight });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    const flight: Flight = this.flightCreateForm.value;
    this.flightsService.postFlight(flight);

    this.flightCreateForm.reset();
  }

  onClear(): void {
    this.flightCreateForm.reset();
  }
}

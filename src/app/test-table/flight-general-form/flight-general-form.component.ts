import { formatDate } from '@angular/common';
import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  DateAdapter,
  MatDateFormats,
  MAT_DATE_FORMATS,
  NativeDateAdapter,
} from '@angular/material/core';
import { Flight } from 'src/app/model/flight.model';

export const PICK_FORMATS: MatDateFormats = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

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
  selector: 'app-flight-general-form',
  templateUrl: './flight-general-form.component.html',
  styleUrls: ['./flight-general-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
  ],
})
export class FlightGeneralFormComponent implements OnInit {
  @Input()
  flight: Flight = {
    origin: '',
    destination: '',
    flightNumber: 0,
    depart: new Date(),
    arrive: new Date(new Date().setDate(new Date().getDate() + 3)),
    isNonstop: false,
  };
  @Input()
  title = '';
  @Input()
  isDialog = false;

  @Output()
  flightSubmit = new EventEmitter<Flight>();
  @Output()
  formExit = new EventEmitter<string>();

  flightForm!: FormGroup;
  formIsValid = true;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.flightForm = this.formBuilder.group({ ...this.flight });
  }

  publishFlight() {
    this.flightSubmit.emit(this.flightForm.value);
    this.flightForm.reset();
  }

  onClear(): void {
    this.flightForm.reset();
  }

  closeForm(): void {
    this.formExit.emit('close <FlightGeneralFormComponent>');
  }
}

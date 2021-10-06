import { formatDate } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  Injectable,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  DateAdapter,
  MatDateFormats,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  NativeDateAdapter,
} from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  selector: 'app-flight-edit-dialog',
  templateUrl: './flight-edit-dialog.component.html',
  styleUrls: ['./flight-edit-dialog.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
  ],
})
export class FlightEditDialogComponent implements OnInit {
  dateRange: FormGroup;
  formIsValid = true;

  @ViewChild('originInput') originInput!: ElementRef;
  @ViewChild('destinationInput') destinationInput!: ElementRef;
  @ViewChild('flightNumInput') flightNumInput!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<FlightEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public flight: Flight,
  ) {
    this.dateRange = new FormGroup({
      depart: new FormControl(new Date(this.flight.depart)),
      arrive: new FormControl(new Date(this.flight.arrive)),
    });
  }

  ngOnInit(): void {}

  submit(): void {
    this.flight.depart = this.dateRange.value.depart;
    this.flight.arrive = this.dateRange.value.arrive;

    this.dialogRef.close(this.flight);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

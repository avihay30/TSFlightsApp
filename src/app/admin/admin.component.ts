import { Component, OnInit } from '@angular/core';
import { Flight } from '../flight.model';
import { FlightsService } from '../flights.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  origin!: string;
  destination!: string;
  flightNumber!: number;
  depart!: Date;
  arrive!: Date;
  isNonstop!: boolean;

  constructor(private flightService: FlightsService) {}

  ngOnInit(): void {}

  toggleNonStop() {
    this.isNonstop = !this.isNonstop;
  }

  sendFlight() {
    const flight: Flight = {
      origin: this.origin,
      destination: this.destination,
      flightNumber: this.flightNumber,
      depart: this.depart,
      arrive: this.arrive,
      isNonstop: this.isNonstop,
    };
    this.flightService.postFlight(flight);
  }
}

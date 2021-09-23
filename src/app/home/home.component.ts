import { Component, OnInit } from '@angular/core';
import { Flight } from '../flight.model';
import { FlightsService } from '../flights.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  flights: Flight[] = [];

  constructor(private flightsService: FlightsService) {}

  ngOnInit(): void {
    this.flights = this.flightsService.getFlights();
  }
}

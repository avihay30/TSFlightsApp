import { Injectable } from '@angular/core';
import { Flight } from './flight.model';

@Injectable({
  providedIn: 'root',
})
export class FlightsService {
  flights: Flight[] = [
    {
      origin: 'Israel',
      destination: 'New York',
      flightNumber: 123,
      depart: new Date(),
      arrive: new Date(),
      isNonstop: true,
    },
    {
      origin: 'Iran',
      destination: 'Syria',
      flightNumber: 456,
      depart: new Date('2020-01-01'),
      arrive: new Date('2020-01-02'),
      isNonstop: true,
    },
  ];

  constructor() {}

  getFlights() {
    return this.flights;
  }

  postFlights(flight: Flight) {}

  deleteFlight(id: number) {}
}

import { Component, OnInit } from '@angular/core';
import { Flight } from '../flight.model';
import { FlightsService } from '../flights.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  flightList!: Flight[];

  // New flight fields
  origin!: string;
  destination!: string;
  flightNumber!: number;
  depart!: Date;
  arrive!: Date;
  isNonstop!: boolean;

  constructor(private flightService: FlightsService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.flightService.getAllFlights().subscribe((data: Flight[]) => {
      this.flightList = data;
    });
  }

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

  update(flight: Flight) {
    this.flightService.updateFlight(flight).subscribe((data) => {
      console.log(data);
      
      if (data) {
        this.refresh();
      }
    });
  }

  delete(flight: Flight) {
    if (window.confirm(`Are you sure you want to delete flight #${flight.flightNumber}?`)) {
      this.flightService.deleteFlight(flight).subscribe((data) => {
        if (data) {
          this.refresh();
        }
      });
    }
  }
}

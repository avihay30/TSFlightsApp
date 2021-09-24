import { Component, OnInit } from '@angular/core';
import { Flight } from '../flight.model';
import { FlightsService } from '../flights.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  flights!: Flight[];
  filteredOriginList!: any[];
  filteredDestinationList!: any[];
  selectedOrigin!: string;
  selectedDestination!: string;

  constructor(private flightsService: FlightsService) {}

  ngOnInit(): void {
    this.flightsService.getFlights().subscribe((data: Flight[]) => {
      this.flights = data;
    });

    this.flightsService.getAllOrigins().subscribe((data: string[]) => {
      this.filteredOriginList = data;
    });

    this.flightsService.getAllDestinations().subscribe((data: string[]) => {
      this.filteredDestinationList = data;
    });
  }

  query(): void {
    const origin = this.selectedOrigin;
    const destination = this.selectedDestination;

    if (origin && destination) {
      this.flightsService
        .getQueriedFlights(origin, destination)
        .subscribe((data: Flight[]) => {
          this.flights = data;
        });
    }
  }
}

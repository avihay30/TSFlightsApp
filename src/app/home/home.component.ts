import { Component, OnInit } from '@angular/core';
import { Flight } from '../flight.model';
import { FlightsService } from '../flights.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  static readonly selectedDefault = 'All';

  flights!: Flight[];
  filteredOriginList: string[];
  filteredDestinationList: string[];
  selectedOrigin!: string;
  selectedDestination!: string;

  constructor(private flightsService: FlightsService) {
    this.selectedOrigin = this.selectedDestination = HomeComponent.selectedDefault;
    this.filteredOriginList = this.filteredDestinationList = [
      HomeComponent.selectedDefault,
    ];
  }

  ngOnInit(): void {
    this.flightsService.getAllFlights().subscribe((data: Flight[]) => {
      this.flights = data;
    });

    this.flightsService.getAllOrigins().subscribe((data: Flight[]) => {
      const origins = data.map((flight: Flight) => flight.origin);
      this.filteredOriginList = this.filteredOriginList.concat(origins);
    });

    this.flightsService.getAllDestinations().subscribe((data: Flight[]) => {
      const destinations = data.map((flight: Flight) => flight.destination);
      this.filteredDestinationList = this.filteredDestinationList.concat(destinations);
    });
  }

  // TBD: add query for all to one and vice versa
  query(): void {
    const selectedDefault = HomeComponent.selectedDefault;
    const origin = this.selectedOrigin;
    const destination = this.selectedDestination;
    const isNotEmpty = origin && destination;
    const isDefault = origin == selectedDefault && destination == selectedDefault;
    if (isDefault) {
      this.flightsService
        .getAllFlights()
        .subscribe((data: Flight[]) => (this.flights = data));
    }
    else if (isNotEmpty) {
      this.flightsService
        .getQueriedFlights(origin, destination)
        .subscribe((data: Flight[]) => (this.flights = data));
    }
  }
}

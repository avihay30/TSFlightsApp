import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from '../flight.model';
import { FlightsService } from '../flights.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  static readonly selectedDefault = 'All';

  loading = true;
  loadingError = false;
  noFlightsFound = false;
  flights: Flight[] = [];
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
    this.query();

    this.flightsService.getAllOrigins().subscribe(
      (data: Flight[]) => {
        const origins = data.map((flight: Flight) => flight.origin);
        this.filteredOriginList = this.filteredOriginList.concat(origins);
        this.loading = this.loadingError = false;
      },
      (err) => (this.loadingError = true),
    );

    this.flightsService.getAllDestinations().subscribe(
      (data: Flight[]) => {
        const destinations = data.map((flight: Flight) => flight.destination);
        this.filteredDestinationList = this.filteredDestinationList.concat(destinations);
        this.loading = this.loadingError = false;
      },
      (err) => (this.loadingError = true),
    );
  }

  // TBD: add query for all to one and vice versa
  query(): void {
    this.noFlightsFound = false;
    const origin = this.selectedOrigin;
    const destination = this.selectedDestination;
    const selectedDefault = HomeComponent.selectedDefault;
    const isDefault = origin == selectedDefault && destination == selectedDefault;
    let subscription: Observable<any>;

    if (isDefault) {
      subscription = this.flightsService.getAllFlights();
    } else {
      subscription = this.flightsService.getQueriedFlights(origin, destination);
    }

    subscription.subscribe((data: Flight[]) => {
      this.flights = data;
      if (!this.flights.length) {
        this.noFlightsFound = true;
      }
    });
  }
}

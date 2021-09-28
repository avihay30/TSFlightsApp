import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Flight } from '../model/flight.model';
import { FlightsService } from '../services/flights.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  private static readonly serverErrorMes =
    "CAN'T LOAD FLIGHTS! TRY AGAIN LATER. (servers might be down)";

  loading = true;
  loadingMessage = 'LOADING FLIGHTS, PLEASE WAIT';
  flightList!: Flight[];

  // newFlight fields
  origin!: string;
  destination!: string;
  flightNumber!: number;
  depart!: Date;
  arrive!: Date;
  isNonstop: boolean = false;

  constructor(private flightService: FlightsService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.flightService.getAllFlights().subscribe(
      (data: Flight[]) => {
        this.flightList = data;
        this.loading = false;
      },
      (err) => (this.loadingMessage = AdminComponent.serverErrorMes),
    );
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
    if (
      window.confirm(`Are you sure you want to delete flight #${flight.flightNumber}?`)
    ) {
      this.flightService.deleteFlight(flight).subscribe((data) => {
        if (data) {
          this.refresh();
        }
      });
    }
  }
}

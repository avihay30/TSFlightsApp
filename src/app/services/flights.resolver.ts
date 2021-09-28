import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Flight } from '../model/flight.model';
import { Observable } from 'rxjs';
import { FlightsService } from './flights.service';

@Injectable()
export class FlightsResolver implements Resolve<Flight[]> {
  constructor(private flightsService: FlightsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<Flight[]> {
    return this.flightsService.getAllFlights();
  }
}

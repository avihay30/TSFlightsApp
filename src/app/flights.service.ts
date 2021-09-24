import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from './flight.model';

@Injectable({
  providedIn: 'root',
})
export class FlightsService {
  flightsApiUrl: string = 'http://localhost:3000/flights';

  constructor(private http: HttpClient) {}

  getFlights(): Observable<any> {
    return this.http.get(this.flightsApiUrl);
  }

  getQueriedFlights(origin: string, destination: string): Observable<any> {
    return this.http.get(
      `${this.flightsApiUrl}/query/${origin}/${destination}`
    );
  }

  postFlight(flight: Flight) {
    return this.http.post(this.flightsApiUrl, flight).subscribe(() => {});
  }

  deleteFlight(id: number) {}

  getAllOrigins(): Observable<any> {
    return this.http.get(`${this.flightsApiUrl}/cities/origins`);
  }

  getAllDestinations(): Observable<any> {
    return this.http.get(`${this.flightsApiUrl}/cities/destinations`);
  }
}

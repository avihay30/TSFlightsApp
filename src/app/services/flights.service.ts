import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from '../model/flight.model';

@Injectable({
  providedIn: 'root',
})
export class FlightsService {
  flightsApiUrl: string = 'http://localhost:3000/flights';

  constructor(private http: HttpClient) {}

  // TODO: Add http response validations.
  //       Add { observe: 'response' } to http call passed params
  //       Add arg value for http calls (e.g get<Flight[]>)

  getAllFlights(): Observable<any> {
    return this.http.get(this.flightsApiUrl);
  }

  getQueriedFlights(origin: string, destination: string): Observable<any> {
    origin = origin.trim().toLowerCase();
    destination = destination.trim().toLowerCase();

    if (origin === '' && destination === '') {
      return this.getAllFlights();
    }
    return this.http.get(`${this.flightsApiUrl}/query/${origin}/${destination}`);
  }

  postFlight(flight: Flight): {} {
    return this.http.post(this.flightsApiUrl, flight).subscribe(() => {});
  }

  deleteFlight(flight: Flight): Observable<any> {
    return this.http.delete(`${this.flightsApiUrl}/${flight.id}/delete`);
  }

  getAllOrigins(): Observable<any> {
    return this.http.get(`${this.flightsApiUrl}/cities/origins`);
  }

  getAllDestinations(): Observable<any> {
    return this.http.get(`${this.flightsApiUrl}/cities/destinations`);
  }

  updateFlight(flight: Flight): Observable<any> { 
    return this.http.patch(`${this.flightsApiUrl}/${flight.id}/update`, flight);
  }
}

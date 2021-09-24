import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from './flight.model';

@Injectable({
  providedIn: 'root',
})
export class FlightsService {
  constructor(private http: HttpClient) {}

  getFlights(): Observable<any> {
    return this.http.get('http://localhost:3000/flights/');
  }

  postFlights(flight: Flight) {}

  deleteFlight(id: number) {}
}

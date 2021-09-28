export interface Flight {
  id?: number;
  origin: string;
  destination: string;
  flightNumber: number;
  depart: Date;
  arrive: Date;
  isNonstop: boolean;
}

export interface FlightQuery {
  origin: string;
  destination: string;
}

export interface Flight {
  origin: string;
  destination: string;
  flightNumber: number;
  depart: Date;
  arrive: Date;
  isNonstop: boolean;
}

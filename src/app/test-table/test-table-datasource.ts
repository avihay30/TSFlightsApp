import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, finalize, map } from 'rxjs/operators';
import {
  Observable,
  of as observableOf,
  merge,
  BehaviorSubject,
  observable,
  pipe,
} from 'rxjs';
import { FlightsService } from '../services/flights.service';
import { Flight, FlightQuery } from '../model/flight.model';
import { Inject, Injectable } from '@angular/core';

/**
 * Data source for the TestTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
@Injectable()
export class TestTableDataSource implements DataSource<Flight> {
  private isSubscriptionPassed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  private flightsSubject = new BehaviorSubject<Flight[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  readonly defaultQuery: FlightQuery = { origin: '', destination: '' };
  readonly defaultSort: MatSort = getDefaultSort();

  public loading$ = this.loadingSubject.asObservable();

  // data: Flight[];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  filter: string | undefined;

  constructor(private flightService: FlightsService) {}

  // constructor(private flightService: FlightsService, @Inject('flightsData') flightsData: Flight[]) {
  // super();
  // this.data = flightsData;
  //// this.loadTableData();
  // }

  /**
   * Reload all dataSource for table, using flightService get request.
   * Filling this.data with response.
   * @returns Whether the subscription has been passed gracefully.
   */
  // loadTableData(): void {
  //   this.flightService.getAllFlights().subscribe(
  //     (flightList: Flight[]) => {
  //       this.data = flightList;
  //       this.isSubscriptionPassed.next(true);
  //     },
  //     (err) => (this.isSubscriptionPassed.next(false)),
  //   );
  // }

  connect(collectionViewer: CollectionViewer): Observable<Flight[]> {
    return this.flightsSubject.asObservable();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  // connect(): Observable<Flight[]> {
  //   this.loadTableData();
  //   let subscription = this.flightService.getAllFlights()
  //   if (this.paginator && this.sort) {
  //     // Combine everything that affects the rendered data into one update
  //     // stream for the data-table to consume.
  //     return merge(observableOf(subscription), this.paginator.page, this.sort.sortChange)
  //       .pipe(map((observableData) => {
  //         // if (typeof(observableData) === Observable)
  //         // this.data = observableData? this.data;
  //         return this.getPagedData(this.getSortedData([...this.data ]));
  //       }));
  //   } else {
  //     throw Error('Please set the paginator and sort on the data source before connecting.');
  //   }
  // }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.flightsSubject.complete();
    this.loadingSubject.complete();
  }

  loadFlights(
    query = this.defaultQuery,
    sort = this.defaultSort,
    pageIndex = 0,
    pageSize = 3,
  ) {
    let serviceSubscription = this.flightService.getAllFlights();
    this.loadingSubject.next(true);
    if (query !== undefined && query !== this.defaultQuery) {
      serviceSubscription = this.flightService.getQueriedFlights(
        query.origin,
        query.destination,
      );
    }

    serviceSubscription
      .pipe(
        catchError(() => observableOf([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe((flights: Flight[]) => {
        flights = this.getSortedData(flights, sort);
        flights = this.getPagedData(flights, pageIndex, pageSize);
        this.flightsSubject.next(flights);
      });
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Flight[], pageIndex: number, pageSize: number): Flight[] {
    const startIndex = pageIndex * pageSize;
    return data.splice(startIndex, pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Flight[], sort: MatSort): Flight[] {
    if (!sort || !sort.active || sort.direction === '') {
      return data;
    }
    // if (sort.direction === '') {
    //   return data;
    // }

    return data.sort((a, b) => {
      const isAsc = sort?.direction === 'asc';
      switch (sort?.active) {
        case 'flightNumber':
          return compare(a.flightNumber, b.flightNumber, isAsc);
        case 'origin':
          return compare(a.origin, b.origin, isAsc);
        case 'destination':
          return compare(a.destination, b.destination, isAsc);
        case 'depart':
          return compare(
            new Date(a.depart).getTime(),
            new Date(b.depart).getTime(),
            isAsc,
          );
        case 'arrive':
          return compare(
            new Date(a.arrive).getTime(),
            new Date(b.arrive).getTime(),
            isAsc,
          );
        case 'isNonstop':
          return compare(a.isNonstop, b.isNonstop, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(
  a: string | number | boolean,
  b: string | number | boolean,
  isAsc: boolean,
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function getDefaultSort(): MatSort {
  let matSort = new MatSort();
  matSort.active = 'flightNumber';
  matSort.direction = 'asc';
  return matSort;
}

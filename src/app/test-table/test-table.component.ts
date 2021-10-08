import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MAT_SORT_DEFAULT_OPTIONS } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, merge, of as observableOf } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Flight, FlightQuery } from '../model/flight.model';
import { FlightsService } from '../services/flights.service';
import { FlightEditDialogComponent } from './flight-edit-dialog/flight-edit-dialog.component';
import { TestTableDataSource } from './test-table-datasource';

@Component({
  selector: 'app-test-table',
  templateUrl: './test-table.component.html',
  styleUrls: ['./test-table.component.scss'],
  providers: [TestTableDataSource, { provide: 'flightsData', useValue: 'flightsData' }],
})
export class TestTableComponent implements AfterViewInit, OnInit {
  flightToBeCreated!: Flight;
  flights!: Flight[];
  dataSource!: TestTableDataSource;
  displayedColumns = [
    'flightNumber',
    'origin',
    'destination',
    'depart',
    'arrive',
    'isNonstop',
    'edit',
    'delete',
  ];

  // edit-table variables
  isEditActive = false;
  editRowId = -1;
  departEditDate = new FormControl(new Date());
  arriveEditDate = new FormControl(new Date());

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('originInput') originSearchInput!: ElementRef;
  @ViewChild('destinationInput') destinationSearchInput!: ElementRef;
  @ViewChild('searchBtn') searchBtn!: ElementRef;
  @ViewChild('arriveRowInput') arriveRowInput!: ElementRef;
  @ViewChild('destinationRowInput') destinationRowInput!: ElementRef;

  // old...
  flightsData: Flight[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatTable) table!: MatTable<Flight>;

  // constructor(
  //   private flightService: FlightsService,
  //   private testTableDataSource: TestTableDataSource,
  // ) {
  //   // this.dataSource = new TestTableDataSource(flightService, this.flightsData);
  //   this.flightService.getAllFlights().subscribe(
  //     (data: Flight[]) => {
  //       this.flightsData = data;
  //       this.isLoadingResults = false;
  //       this.dataSource = new TestTableDataSource(flightService, this.flightsData);
  //     },
  //     // (err) => (this.loadingMessage = "AdminComponent.serverErrorMes"),
  //   );
  //   // this.dataSource = new TestTableDataSource(flightService, this.flightsData);
  //   // this.testTableDataSource.isSubscriptionPassed.subscribe(
  //   //   (value) => (this.isLoadingResults = value),
  //   // );
  // }

  constructor(
    private flightService: FlightsService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    // On ngOnInit @ViewChild component variables doesn't exists.
    this.flights = this.route.snapshot.data['flights'];
    this.dataSource = new TestTableDataSource(this.flightService);

    // Getting sort and query default values as in html template.
    const defaultSort = this.dataSource.defaultSort;
    const defaultQuery = this.dataSource.defaultQuery;
    this.dataSource.loadFlights(defaultQuery, defaultSort, 0, 3);
  }

  ngAfterViewInit() {
    // // server-side search
    // fromEvent(this.originInput.nativeElement, 'keyup')
    //   .pipe(
    //     // debounceTime(1500),
    //     // distinctUntilChanged(),
    //     tap(() => {
    //       this.paginator.firstPage();
    //       this.loadFlightsPage();
    //     }),
    //   )
    //   .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.firstPage());

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadFlightsPage()))
      .subscribe();
  }

  loadFlightsPage(): void {
    let query!: FlightQuery;
    if (
      this.originSearchInput !== undefined &&
      this.destinationSearchInput !== undefined
    ) {
      query = {
        origin: this.originSearchInput.nativeElement.value,
        destination: this.destinationSearchInput.nativeElement.value,
      };
    }

    this.dataSource.loadFlights(
      query,
      this.sort,
      this.paginator.pageIndex,
      this.paginator.pageSize,
    );
  }

  searchFlights(): void {
    // server-side search
    this.paginator.firstPage();
    this.loadFlightsPage();
  }

  deleteRow(flight: Flight): void {
    if (
      window.confirm(`Are you sure you want to delete flight #${flight.flightNumber}?`)
    ) {
      this.flightService.deleteFlight(flight).subscribe((data) => {
        if (data) {
          this.loadFlightsPage();
        }
      });
    }
  }

  openDialog(flightToEdit: Flight): void {
    const dialogRef = this.dialog.open(FlightEditDialogComponent, {
      width: '50%',
      data: { ...flightToEdit },
    });

    dialogRef.afterClosed().subscribe((editedFlight?: Flight) => {
      if (editedFlight !== undefined) {
        this.flightService.updateFlight(editedFlight).subscribe((data) => {
          if (data) this.loadFlightsPage();
        });
      }
    });
  }

  toggleEdit(flight: Flight): void {
    this.isEditActive = !this.isEditActive;
    this.editRowId = flight.id ? flight.id : -1;

    // departEditDate = new FormControl(new Date());

    this.departEditDate.setValue(flight.depart);
    this.arriveEditDate.setValue(flight.arrive);
  }

  // refresh() {
  //   this.isLoadingResults = true;
  //   this.flightService.getAllFlights().subscribe(
  //     (data: Flight[]) => {
  //       this.flightsData = data;
  //       this.isLoadingResults = false;
  //     },
  //     // (err) => (this.loadingMessage = "AdminComponent.serverErrorMes"),
  //   );
  // }

  // ngAfterViewInit(): void {
  //   // // If the user changes the sort order, reset back to the first page.
  //   // this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

  //   // merge(this.sort.sortChange, this.paginator.page)
  //   //   .pipe(
  //   //     startWith({}),
  //   //     switchMap(() => {
  //   //       this.isLoadingResults = true;
  //   //       return this.flightService
  //   //         .getAllFlights()
  //   //         .pipe(catchError(() => observableOf(null)));
  //   //     }),
  //   //     map((data) => {
  //   //       // Flip flag to show that loading has finished.
  //   //       this.isLoadingResults = false;

  //   //       if (data === null) {
  //   //         return [];
  //   //       }

  //   //       // Only refresh the result length if there is new data. In case of rate
  //   //       // limit errors, we do not want to reset the paginator to zero, as that
  //   //       // would prevent users from re-triggering requests.

  //   //       this.resultsLength = data.length;
  //   //       return data.items;
  //   //     }),
  //   //   )
  //   //   .subscribe((data) => (this.flightsData = data));

  //   this.dataSource.sort = this.sort;
  //   this.dataSource.paginator = this.paginator;
  //   // this.table.dataSource = this.dataSource;
  // }
}

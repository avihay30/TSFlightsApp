import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightCreateFormComponent } from './flight-create-form.component';

describe('FlightCreateFormComponent', () => {
  let component: FlightCreateFormComponent;
  let fixture: ComponentFixture<FlightCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightCreateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

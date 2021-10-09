import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightGeneralFormComponent } from './flight-general-form.component';

describe('FlightGeneralFormComponent', () => {
  let component: FlightGeneralFormComponent;
  let fixture: ComponentFixture<FlightGeneralFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightGeneralFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightGeneralFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

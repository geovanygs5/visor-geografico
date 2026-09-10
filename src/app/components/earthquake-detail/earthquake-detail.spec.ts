import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EarthquakeDetail } from './earthquake-detail';

describe('EarthquakeDetail', () => {
  let component: EarthquakeDetail;
  let fixture: ComponentFixture<EarthquakeDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarthquakeDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(EarthquakeDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

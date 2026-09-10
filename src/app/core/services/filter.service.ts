import { Injectable, signal } from '@angular/core';
import { Earthquake } from '../models/earthquake.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private magRangeSignal = signal<{ min: number; max: number }>({
    min: 4.5,
    max: 10
  });
  public magRange = this.magRangeSignal.asReadonly();

  private dateRangeSignal = signal<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  public dateRange = this.dateRangeSignal.asReadonly();

  updateMagRange(min: number, max: number): void {
    this.magRangeSignal.set({ min, max });
  }

  updateDateRange(start: Date, end: Date): void {
    this.dateRangeSignal.set({ start, end });
  }

  filterEarthquakes(earthquakes: Earthquake[]): Earthquake[] {
    const mag = this.magRangeSignal();
    const date = this.dateRangeSignal();

    return earthquakes.filter(eq => 
      eq.mag >= mag.min && 
      eq.mag <= mag.max &&
      eq.time >= date.start &&
      eq.time <= date.end
    );
  }
}
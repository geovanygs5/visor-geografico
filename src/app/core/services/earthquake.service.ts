import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Earthquake, UsgsResponse } from '../models/earthquake.model';

@Injectable({
  providedIn: 'root'
})
export class EarthquakeService {
  private readonly API_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson';
  
  private earthquakesSignal = signal<Earthquake[]>([]);
  public earthquakes = this.earthquakesSignal.asReadonly();
  
  public loading = signal<boolean>(false);
  public error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  fetchEarthquakes(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<UsgsResponse>(this.API_URL).subscribe({
      next: (response) => {
        const mapped = this.mapToEarthquakes(response);
        this.earthquakesSignal.set(mapped);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los datos de terremotos');
        this.loading.set(false);
        console.error('Error fetching earthquakes:', err);
      }
    });
  }

  private mapToEarthquakes(response: UsgsResponse): Earthquake[] {
    return response.features.map(feature => ({
      id: feature.id,
      mag: feature.properties.mag,
      place: feature.properties.place,
      time: new Date(feature.properties.time),
      longitude: feature.geometry.coordinates[0],
      latitude: feature.geometry.coordinates[1],
      depth: feature.geometry.coordinates[2],
      status: feature.properties.status,
      url: feature.properties.url,
      title: feature.properties.title
    }));
  }
}
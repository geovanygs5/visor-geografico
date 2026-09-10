import { Injectable, signal, computed } from '@angular/core';
import { Earthquake } from '../models/earthquake.model';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {
  private selectedIdSignal = signal<string | null>(null);
  public selectedId = this.selectedIdSignal.asReadonly();

  private hoveredIdSignal = signal<string | null>(null);
  public hoveredId = this.hoveredIdSignal.asReadonly();

  // NUEVO: guarda el objeto completo del sismo seleccionado
  private selectedEarthquakeSignal = signal<Earthquake | null>(null);
  public selectedEarthquake = this.selectedEarthquakeSignal.asReadonly();

  selectEarthquake(earthquake: Earthquake | null): void {
    this.selectedEarthquakeSignal.set(earthquake);
    this.selectedIdSignal.set(earthquake?.id ?? null);
  }

  hoverEarthquake(id: string | null): void {
    this.hoveredIdSignal.set(id);
  }

  clearSelection(): void {
    this.selectedEarthquakeSignal.set(null);
    this.selectedIdSignal.set(null);
    this.hoveredIdSignal.set(null);
  }
}
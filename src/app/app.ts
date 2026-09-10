import { Component, inject, OnInit, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EarthquakeService } from './core/services/earthquake.service';
import { FilterService } from './core/services/filter.service';
import { SelectionService } from './core/services/selection.service';
import { MapComponent } from './components/map/map';
import { ListComponent } from './components/list/list';
import { FiltersComponent } from './components/filters/filters';
import { EarthquakeDetailComponent } from './components/earthquake-detail/earthquake-detail';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MapComponent,
    ListComponent,
    FiltersComponent,
    EarthquakeDetailComponent
  ],
  template: `
  <div class="h-screen flex flex-col" style="height: 100vh; display: flex; flex-direction: column;">
    <header class="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-4" 
            style="flex-shrink: 0;">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold">🌍 Visor de Terremotos</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-300">
            {{ filteredEarthquakes().length }} sismos mostrados
          </span>
          <span *ngIf="earthquakeService.loading()" class="text-sm text-yellow-300">
            Cargando...
          </span>
        </div>
      </div>
    </header>
  
    <div style="flex: 1; display: flex; overflow: hidden; min-height: 0;">
      <!-- Mapa -->
      <div style="width: 75%; height: 100%; position: relative;">
        <app-map 
          #mapComponent
          [earthquakes]="filteredEarthquakes()"
        />
      </div>
  
      <!-- Panel lateral -->
      <div style="width: 25%; height: 100%; display: flex; flex-direction: column; border-left: 1px solid #e5e7eb; background: #f9fafb;">
        <app-filters style="flex-shrink: 0;" />
        <app-earthquake-detail /> 
        <app-list 
          style="flex: 1; overflow-y: auto;"
          [earthquakes]="filteredEarthquakes()"
          [selectedId]="selectionService.selectedId()"
          [hoveredId]="selectionService.hoveredId()"
          (earthquakeSelect)="onEarthquakeSelect($event)"
          (earthquakeHover)="onEarthquakeHover($event)"
        />
      </div>
    </div>
  </div>
`,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class App implements OnInit {
  @ViewChild('mapComponent') mapComponent!: MapComponent;

  protected earthquakeService = inject(EarthquakeService);
  protected filterService = inject(FilterService);
  protected selectionService = inject(SelectionService);

  protected filteredEarthquakes = computed(() => {
    const data = this.earthquakeService.earthquakes();
    return this.filterService.filterEarthquakes(data);
  });

  ngOnInit(): void {
    this.earthquakeService.fetchEarthquakes();
  }

  onEarthquakeSelect(id: string): void {
    const earthquake = this.earthquakeService.earthquakes().find(eq => eq.id === id);
    if (earthquake) {
      this.selectionService.selectEarthquake(earthquake);  
    }
    if (this.mapComponent) {
      this.mapComponent.flyToEarthquake(id);
    }
  }

  onEarthquakeHover(id: string | null): void {
    this.selectionService.hoverEarthquake(id);
  }
}
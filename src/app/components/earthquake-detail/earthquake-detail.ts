import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionService } from '../../core/services/selection.service';

@Component({
  selector: 'app-earthquake-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 border-b border-gray-200 bg-white" *ngIf="earthquake() as eq; else noSelection">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-gray-700">Detalle del Sismo</h3>
        <button 
          (click)="clearSelection()"
          class="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
          title="Cerrar detalle"
        >
          ✕
        </button>
      </div>

      <div class="space-y-2 text-sm">
        <div>
          <span class="font-semibold text-gray-500 text-xs uppercase">Lugar</span>
          <p class="text-gray-800">{{ eq.place || 'Desconocido' }}</p>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <span class="font-semibold text-gray-500 text-xs uppercase">Magnitud</span>
            <p class="font-bold text-lg" [style.color]="getMagnitudeColor(eq.mag)">
              {{ eq.mag.toFixed(1) }}
            </p>
          </div>
          <div>
            <span class="font-semibold text-gray-500 text-xs uppercase">Profundidad</span>
            <p class="text-gray-800 font-medium">{{ eq.depth.toFixed(1) }} km</p>
          </div>
        </div>

        <div>
          <span class="font-semibold text-gray-500 text-xs uppercase">Fecha y hora</span>
          <p class="text-gray-800">{{ eq.time | date:'dd/MM/yyyy HH:mm:ss' }}</p>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <span class="font-semibold text-gray-500 text-xs uppercase">Estado</span>
            <p>
              <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {{ eq.status }}
              </span>
            </p>
          </div>
          <div>
            <span class="font-semibold text-gray-500 text-xs uppercase">Coordenadas</span>
            <p class="text-xs text-gray-700">
              {{ eq.latitude.toFixed(2) }}, {{ eq.longitude.toFixed(2) }}
            </p>
          </div>
        </div>

        <div class="pt-2">
          <a 
            [href]="eq.url" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Ver en USGS →
          </a>
        </div>
      </div>
    </div>

    <ng-template #noSelection>
      <div class="p-4 border-b border-gray-200 bg-gray-50 text-center">
        <p class="text-xs text-gray-500">
          Selecciona un punto en el mapa o una tarjeta para ver el detalle
        </p>
      </div>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      flex-shrink: 0;
    }
  `]
})
export class EarthquakeDetailComponent {
  private selectionService = inject(SelectionService);

  earthquake = computed(() => this.selectionService.selectedEarthquake());

  clearSelection(): void {
    this.selectionService.clearSelection();
  }

  getMagnitudeColor(mag: number): string {
    if (mag >= 7) return '#d73027';
    if (mag >= 6) return '#fc8d59';
    if (mag >= 5) return '#e6b800';
    if (mag >= 4.5) return '#91bfdb';
    return '#91bfdb';
  }
}
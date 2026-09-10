import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../core/services/filter.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 bg-white border-b border-gray-200">
      <h3 class="font-semibold text-gray-700 mb-3">Filtros</h3>
      
      <!-- Filtro de Magnitud -->
      <div class="mb-4">
        <label class="block text-sm text-gray-600 mb-1">
          Magnitud: {{ magMin }} - {{ magMax }}
        </label>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500">4.5</span>
          <input 
            type="range" 
            class="flex-1"
            [min]="4.5" 
            [max]="10" 
            [step]="0.1"
            [value]="magMin"
            (input)="updateMagRange($event)"
          />
          <input 
            type="range" 
            class="flex-1"
            [min]="4.5" 
            [max]="10" 
            [step]="0.1"
            [value]="magMax"
            (input)="updateMagRange($event, 'max')"
          />
          <span class="text-xs text-gray-500">10</span>
        </div>
        <div class="flex justify-between text-xs text-gray-400 mt-1">
          <span>Mín: {{ magMin.toFixed(1) }}</span>
          <span>Máx: {{ magMax.toFixed(1) }}</span>
        </div>
      </div>

      <!-- Filtro de Fechas -->
      <div>
        <label class="block text-sm text-gray-600 mb-1">Rango de Fechas</label>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-xs text-gray-500">Desde</label>
            <input 
              type="date" 
              class="w-full border rounded px-2 py-1 text-sm"
              [value]="dateStart | date:'yyyy-MM-dd'"
              (change)="updateDateRange($event, 'start')"
            />
          </div>
          <div>
            <label class="text-xs text-gray-500">Hasta</label>
            <input 
              type="date" 
              class="w-full border rounded px-2 py-1 text-sm"
              [value]="dateEnd | date:'yyyy-MM-dd'"
              (change)="updateDateRange($event, 'end')"
            />
          </div>
        </div>
      </div>

      <!-- Botón de Reset -->
      <button 
        class="mt-3 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm transition-colors"
        (click)="resetFilters()"
      >
        Restablecer Filtros
      </button>
    </div>
  `,
  styles: [`
    input[type="range"] {
      height: 4px;
      -webkit-appearance: none;
      background: #d1d5db;
      border-radius: 2px;
    }
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #3b82f6;
      cursor: pointer;
    }
  `]
})
export class FiltersComponent {
  private filterService = inject(FilterService);

  magMin = 4.5;
  magMax = 10;
  dateStart: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  dateEnd: Date = new Date();

  constructor() {
    const magRange = this.filterService.magRange();
    this.magMin = magRange.min;
    this.magMax = magRange.max;
    
    const dateRange = this.filterService.dateRange();
    this.dateStart = dateRange.start;
    this.dateEnd = dateRange.end;
  }

  updateMagRange(event: Event, type: 'min' | 'max' = 'min'): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);

    if (type === 'min') {
      this.magMin = Math.min(value, this.magMax - 0.1);
    } else {
      this.magMax = Math.max(value, this.magMin + 0.1);
    }

    this.filterService.updateMagRange(this.magMin, this.magMax);
  }

  updateDateRange(event: Event, type: 'start' | 'end'): void {
    const input = event.target as HTMLInputElement;
    const date = new Date(input.value + 'T00:00:00');

    if (type === 'start') {
      this.dateStart = date;
    } else {
      this.dateEnd = date;
    }

    this.filterService.updateDateRange(this.dateStart, this.dateEnd);
  }

  resetFilters(): void {
    this.magMin = 4.5;
    this.magMax = 10;
    this.dateStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    this.dateEnd = new Date();

    this.filterService.updateMagRange(this.magMin, this.magMax);
    this.filterService.updateDateRange(this.dateStart, this.dateEnd);
  }
}
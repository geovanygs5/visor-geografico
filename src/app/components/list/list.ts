import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Earthquake } from '../../core/models/earthquake.model';
import { SelectionService } from '../../core/services/selection.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h2 class="text-lg font-semibold mb-4 text-gray-700">
        Lista de Sismos ({{ earthquakes.length }})
      </h2>
      
      <div *ngIf="earthquakes.length === 0" class="text-center text-gray-500 py-8">
        No hay sismos con los filtros actuales
      </div>

      <div class="space-y-3">
        <div 
          *ngFor="let earthquake of earthquakes"
          class="bg-white rounded-lg shadow-md p-4 border-l-4 transition-all cursor-pointer hover:shadow-lg"
          [class.border-red-500]="selectedId === earthquake.id"
          [class.border-green-400]="hoveredId === earthquake.id"
          [class.border-gray-300]="selectedId !== earthquake.id && hoveredId !== earthquake.id"
          [class.bg-red-50]="selectedId === earthquake.id"
          [class.bg-green-50]="hoveredId === earthquake.id && selectedId !== earthquake.id"
          (click)="onCardClick(earthquake.id)"
          (mouseenter)="onCardHover(earthquake.id)"
          (mouseleave)="onCardHover(null)"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-800 truncate" [title]="earthquake.place">
                {{ earthquake.place || 'Ubicación desconocida' }}
              </h3>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-sm text-gray-600">
                  Magnitud: <span class="font-bold" [style.color]="getMagnitudeColor(earthquake.mag)">
                    {{ earthquake.mag.toFixed(1) }}
                  </span>
                </span>
                <span class="text-xs text-gray-400">|</span>
                <span class="text-xs text-gray-500">
                  {{ earthquake.time | date:'dd/MM/yyyy HH:mm' }}
                </span>
              </div>
              <div class="mt-1">
                <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {{ earthquake.status }}
                </span>
              </div>
            </div>
            <div class="text-right flex-shrink-0 ml-4">
              <span class="text-lg font-bold" [style.color]="getMagnitudeColor(earthquake.mag)">
                {{ earthquake.mag.toFixed(1) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    .border-l-4 {
      border-left-width: 4px;
    }
    .truncate {
      max-width: 200px;
    }
  `]
})
export class ListComponent {
  @Input() earthquakes: Earthquake[] = [];
  @Input() selectedId: string | null = null;
  @Input() hoveredId: string | null = null;
  @Output() earthquakeSelect = new EventEmitter<string>();
  @Output() earthquakeHover = new EventEmitter<string | null>();

  private selectionService = inject(SelectionService);

  onCardClick(id: string): void {
    this.earthquakeSelect.emit(id);
  }

  onCardHover(id: string | null): void {
    this.earthquakeHover.emit(id);
  }

  getMagnitudeColor(mag: number): string {
    if (mag >= 7) return '#d73027';
    if (mag >= 6) return '#fc8d59';
    if (mag >= 5) return '#ffffbf';
    if (mag >= 4.5) return '#91bfdb';
    return '#91bfdb';
  }
}
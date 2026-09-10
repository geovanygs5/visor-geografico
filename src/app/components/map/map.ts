import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  effect,
  inject,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import { Map as MapLibreMap, GeoJSONSource, MapLayerMouseEvent } from 'maplibre-gl';
import { Earthquake } from '../../core/models/earthquake.model';
import { SelectionService } from '../../core/services/selection.service';

@Component({
  selector: 'app-map',
  standalone: true,
  template: `<div #mapContainer style="width: 100%; height: 100%;"></div>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @Input() earthquakes: Earthquake[] = [];

  private map!: MapLibreMap;
  private selectionService = inject(SelectionService);

  private readonly SOURCE_ID = 'earthquakes';
  private readonly LAYER_ID = 'earthquake-points';
  private mapReady = false;

  constructor() {
    // Reacciona a cambios de hoveredId / selectedId
    effect(() => {
      const hovered = this.selectionService.hoveredId();
      const selected = this.selectionService.selectedId();
      void hovered;
      void selected;

      if (this.mapReady) {
        this.updateFeatureStates();
      }
    });

    // Reacciona a cambios en la lista de terremotos
    effect(() => {
      const eqs = this.earthquakes;
      void eqs;
      if (this.mapReady) {
        this.updateEarthquakeSource();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private initializeMap(): void {
    this.map = new maplibregl.Map({
      container: this.mapContainer.nativeElement,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-100, 30],
      zoom: 2,
      maxCanvasSize: [8192, 8192],
    });

    // 🔥 ESTE BLOQUE ES EL QUE FALTABA
    this.map.on('load', () => {
      this.addEarthquakeSource();
      this.setupClickEvents();
      this.mapReady = true;

      // Actualizar datos iniciales
      this.updateEarthquakeSource();
      this.updateFeatureStates();

      setTimeout(() => this.map.resize(), 200);
    });

    window.addEventListener('resize', () => {
      if (this.map) this.map.resize();
    });
  }

  private addEarthquakeSource(): void {
    if (this.map.getSource(this.SOURCE_ID)) return;

    this.map.addSource(this.SOURCE_ID, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
      promoteId: 'id'
    });

    this.map.addLayer({
      id: this.LAYER_ID,
      type: 'circle',
      source: this.SOURCE_ID,
      paint: {
        'circle-radius': [
          'interpolate', ['linear'], ['get', 'mag'],
          2, 6, 4, 12, 6, 20, 8, 30
        ],
        'circle-color': [
          'interpolate', ['linear'], ['get', 'mag'],
          2, '#91bfdb', 4, '#ffffbf', 6, '#fc8d59', 8, '#d73027'
        ],
        'circle-stroke-width': [
          'case',
          ['boolean', ['feature-state', 'selected'], false], 3,
          ['boolean', ['feature-state', 'hovered'], false], 2,
          1
        ],
        'circle-stroke-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false], '#ff0000',
          ['boolean', ['feature-state', 'hovered'], false], '#00ff00',
          '#000000'
        ],
        'circle-opacity': 0.8
      }
    });
  }

  private updateEarthquakeSource(): void {
    if (!this.map || !this.map.getSource(this.SOURCE_ID)) return;

    const features = this.earthquakes.map(eq => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [eq.longitude, eq.latitude]
      },
      properties: {
        id: eq.id,
        mag: eq.mag,
        place: eq.place,
        time: eq.time.getTime(),
        status: eq.status,
        title: eq.title
      }
    }));

    const source = this.map.getSource(this.SOURCE_ID) as GeoJSONSource;
    source.setData({ type: 'FeatureCollection', features });
  }

  private updateFeatureStates(): void {
    if (!this.map || !this.map.getSource(this.SOURCE_ID)) return;

    this.map.removeFeatureState({ source: this.SOURCE_ID });

    const hovered = this.selectionService.hoveredId();
    const selected = this.selectionService.selectedId();

    if (hovered) {
      this.map.setFeatureState(
        { source: this.SOURCE_ID, id: hovered },
        { hovered: true }
      );
    }

    if (selected) {
      this.map.setFeatureState(
        { source: this.SOURCE_ID, id: selected },
        { selected: true }
      );
    }
  }

  private setupClickEvents(): void {
    // Click sobre un punto
    this.map.on('click', this.LAYER_ID, (e: MapLayerMouseEvent) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const id = feature.properties?.['id'] as string;
        if (id) {
          const earthquake = this.earthquakes.find(eq => eq.id === id);
          if (earthquake) {
            this.selectionService.selectEarthquake(earthquake);
          }
        }
      }
    });

    // Hover
    this.map.on('mouseenter', this.LAYER_ID, () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('mouseleave', this.LAYER_ID, () => {
      this.map.getCanvas().style.cursor = 'default';
    });

    // Click en el vacío → limpiar
    this.map.on('click', (e: MapLayerMouseEvent) => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: [this.LAYER_ID]
      });
      if (features.length === 0) {
        this.selectionService.clearSelection();
      }
    });
  }

  flyToEarthquake(id: string): void {
    const earthquake = this.earthquakes.find(eq => eq.id === id);
    if (earthquake && this.map) {
      this.map.flyTo({
        center: [earthquake.longitude, earthquake.latitude],
        zoom: 6,
        duration: 1000
      });
    }
  }
}
import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  template: `<div [id]="mapId" [style.height]="height" class="w-100"></div>`,
})
export class MapaComponent implements AfterViewInit, OnDestroy {
  @Input() lat: number = 0;
  @Input() lng: number = 0;
  @Input() titulo: string = '';
  @Input() height: string = '400px';

  mapId = 'map-' + Math.floor(Math.random() * 1000000);
  private map?: L.Map;

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    // Guard: if coordinates not valid, center on [0,0]
    const lat = Number(this.lat) || 0;
    const lng = Number(this.lng) || 0;

    this.map = L.map(this.mapId).setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Use a circle marker to avoid depending on external marker images
    L.circleMarker([lat, lng], {
      radius: 8,
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.7,
    })
      .addTo(this.map)
      .bindPopup(this.titulo || '')
      .openPopup();
  }
}

import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PartidoService } from '../../../service/partido';
import { IPartido } from '../../../model/partido';
import { MapaComponent } from '../../shared/mapa/mapa';

@Component({
  selector: 'app-partido-mapa',
  imports: [RouterLink, MapaComponent],
  templateUrl: './partido-mapa.html',
  styleUrl: './partido-mapa.css',
})
export class PartidoMapaAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private partidoService = inject(PartidoService);

  oPartido = signal<IPartido | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  id_partido = signal<number>(0);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id_partido.set(idParam ? Number(idParam) : NaN);

    if (isNaN(this.id_partido())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.load(this.id_partido());
  }

  private load(id: number) {
    this.partidoService.get(id).subscribe({
      next: (data: IPartido) => {
        this.oPartido.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error al recuperar el partido: ' + err.message);
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}

import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ClubService } from '../../../service/club';
import { IClub } from '../../../model/club';
import { MapaComponent } from '../../shared/mapa/mapa';

@Component({
  selector: 'app-club-mapa',
  imports: [RouterLink, MapaComponent],
  templateUrl: './club-mapa.html',
  styleUrl: './club-mapa.css',
})
export class ClubMapaAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private clubService = inject(ClubService);

  oClub = signal<IClub | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  id_club = signal<number>(0);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id_club.set(idParam ? Number(idParam) : NaN);

    if (isNaN(this.id_club())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.load(this.id_club());
  }

  private load(id: number) {
    this.clubService.get(id).subscribe({
      next: (data: IClub) => {
        this.oClub.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error al recuperar el club: ' + err.message);
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}

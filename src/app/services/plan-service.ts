import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Planes, PlanResponse } from '../models/Planes';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private url = 'api/planes';

  constructor(private http: HttpClient) {}

  listarPlanes(page: number, size: number): Observable<PlanResponse> {
    return this.http.get<PlanResponse>(`${this.url}/listar?page=${page}&size=${size}`);
  }

  buscarPlanId(id: number): Observable<Planes> {
    return this.http.get<Planes>(`${this.url}/${id}`).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error('Error al buscar el plan:', error);
            return throwError(() => new Error('Error al buscar el plan'));
        })
    );
}

  registrarPlan(plan: Planes): Observable<Planes> {
    return this.http.post<Planes>(`${this.url}/registrar`, plan);
  }

  actualizarPlan(plan: Planes): Observable<Planes> {
    return this.http.put<Planes>(`${this.url}/actualizar/${plan.id_plan}`, plan);
  }

  eliminarPlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/eliminar/${id}`);
  }
}

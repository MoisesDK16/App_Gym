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
    return this.http.get<PlanResponse>(`${this.url}/me/listar?page=${page}&size=${size}`);
  }

  listarPlanes2(): Observable<Planes[]> {
    return this.http.get<Planes[]>(`${this.url}/me/all`);
  }

  buscarPlanId(id: number): Observable<Planes> {
    return this.http.get<Planes>(`${this.url}/me/${id}`).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error('Error al buscar el plan:', error);
            return throwError(() => new Error('Error al buscar el plan'));
        })
    );
}

  registrarPlan(plan: FormData): Observable<Planes> {
    return this.http.post<Planes>(`${this.url}/registrar`, plan);
  }

  insertarImagen(data: FormData, id_plan: number): Observable<Planes> {
    return this.http.patch<Planes>(`${this.url}/newImage/${id_plan}`, data);
  }

  actualizarPlan(plan: Planes): Observable<Planes> {
    return this.http.put<Planes>(`${this.url}/actualizar/${plan.id_plan}`, plan);
  }

  eliminarPlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/eliminar/${id}`);
  }

  agregarServicio(id_plan: number, id_servicio: any): Observable<Planes> {
    return this.http.post<Planes>(`${this.url}/agregar-servicio?id_plan=${id_plan}&id_servicio=${id_servicio}`, null);
  }

  eliminarServicio(id_plan: number, id_servicio: any): Observable<Planes> {
    return this.http.post<Planes>(`${this.url}/eliminar-servicio?id_plan=${id_plan}&id_servicio=${id_servicio}`, null);
  }
}

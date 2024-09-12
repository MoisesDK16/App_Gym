import { EventEmitter, Injectable, OnInit, Output } from '@angular/core';
import { Clientes } from '../models/Clientes';
import { PlanService } from './plan-service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  cliente: Clientes = new Clientes(
    '2350918856',
    'cedula',
    'Moises',
    'Loor',
    'Vasquez',
    'moisesloor12@gmail.com',
    '1234',
    'pepe',
    '019182728'
  );

  @Output() id_plan: EventEmitter<number> = new EventEmitter<number>();
  
  constructor(private _planService: PlanService) {}

  getCliente(): Clientes {
    return this.cliente;
  }


  // getIdPlan(): number {
  //   console.log("Getting id_plan: ", this.id_plan);
  //   return this.id_plan;
  // }

  // async unoPlan(id: number): Promise<any> {
  //   return new Promise<any>((resolve, reject) => {
  //     this._planService.buscarPlanId(id).subscribe(
  //       (data: any) => {
  //         this.plan$.next(data);
  //         this.id_plan = data.id_plan;
  //         this.plan = data;
  //         console.log('Plan encontrado:', data);
  //         resolve(data);
  //       },
  //       (error) => {
  //         console.error('Error al buscar el plan:', error);
  //         reject(error);
  //       }
  //     );
  //   });
  // }

  // async getPlan(): Promise<Observable<any>> {
  //   return this.plan$.asObservable();
  // }

}

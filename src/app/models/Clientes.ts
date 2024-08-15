export interface ClienteResponse{
  [x: string]: any;
  totalElements: number,
  content: Clientes[],
  totalPages: number,
  size: number
}

export class Clientes {
    id_cliente: string;
    tipo_identificacion: string;
    nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    correo: string;
    clave: string;
    direccion: string;
    telefono: string;
  
    constructor(
      id_cliente: string,
      tipo_identificacion: string,
      nombre: string,
      primer_apellido: string,
      segundo_apellido: string,
      correo: string,
      clave: string,
      direccion: string,
      telefono: string
    ) {
      this.id_cliente = id_cliente;
      this.tipo_identificacion = tipo_identificacion;
      this.nombre = nombre;
      this.primer_apellido = primer_apellido;
      this.segundo_apellido = segundo_apellido;
      this.correo = correo;
      this.clave = clave;
      this.direccion = direccion;
      this.telefono = telefono;
    }
  }
  
class Personal {
    id_usuario: number;
    cargo: string;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    correo: string;
    clave: string;
    direccion: string;
    telefono: string;
    fechaNacimiento: Date;

    constructor(
        id_usuario: number,
        cargo: string,
        nombre: string,
        primerApellido: string,
        segundoApellido: string,
        correo: string,
        clave: string,
        direccion: string,
        telefono: string,
        fechaNacimiento: Date
    ) {
        this.id_usuario = id_usuario;
        this.cargo = cargo;
        this.nombre = nombre;
        this.primerApellido = primerApellido;
        this.segundoApellido = segundoApellido;
        this.correo = correo;
        this.clave = clave;
        this.direccion = direccion;
        this.telefono = telefono;
        this.fechaNacimiento = fechaNacimiento;           
    }
}
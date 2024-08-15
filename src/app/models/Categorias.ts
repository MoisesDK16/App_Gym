export interface CategoriasResponse {
  content: Categorias[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export class Categorias {
  id_categoria: number;
  categoria: string;

  constructor(id_categoria: number, categoria: string) {
    this.id_categoria = id_categoria;
    this.categoria = categoria;
  }
}

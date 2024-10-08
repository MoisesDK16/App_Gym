export interface CategoriasResponse {
  content: Categorias[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export class Categorias {
  id_categoria?: number;
  categoria: string;

  constructor(categoria: string) {
    this.categoria = categoria;
  }
}

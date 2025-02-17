import { Component,OnInit } from '@angular/core';
import { ProductsData } from '../../data/dataLocal'; // Importa los datos desde la carpeta data
import { RouterModule } from '@angular/router'; // ✅ IMPORTAR RouterModule
import { CommonModule } from '@angular/common'; // 🔹 Importa CommonModule
import { Producto } from '../../models/product.model';//'../models/product.model';
import { FormsModule } from '@angular/forms'; // Importar FormsModule para el buscador
import { NgxPaginationModule } from 'ngx-pagination'; // ✅ Importar módulo de paginación

@Component({
  selector: 'app-catalogo',
  imports: [RouterModule,CommonModule,FormsModule,NgxPaginationModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit {
  //productos: { id: number; nombre: string; precio: number; imagen: string; }[] = []; // ✅ Definir tipo correctamente
  productos: Producto[] = []; // ✅ Definir correctamente el tipo
  productosFiltrados: Producto[] = [];
  searchText = '';
  page:number = 1;
  pageSize: number=6;

  categorias: string[] = [];
  categoriaSeleccionada: string = '';


  ngOnInit(): void {
    this.productos = ProductsData; // Ahora la asignación será válida
    this.productosFiltrados= this.productos;
    // Obtener categorías únicas
    this.categorias = [...new Set(this.productos.map(producto => producto.categoria))];
  }

  filtrarProductos() {
    this.productosFiltrados = this.productos
    .filter(producto =>
      producto.nombre.toLowerCase().includes(this.searchText.toLowerCase()) &&
      (this.categoriaSeleccionada ? producto.categoria === this.categoriaSeleccionada : true)
    );
    this.page = 1; // Reiniciar paginación al filtrar
  }

  filtrarPorCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.filtrarProductos();
  }


}

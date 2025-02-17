import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsData } from '../../data/dataLocal';
import { Producto } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { HttpClient,HttpClientModule, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http'
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms'; // Add this import
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-producto-detalle',
  imports: [CommonModule,HttpClientModule,FormsModule],
  templateUrl: './producto-detalle.component.html',
  styleUrl: './producto-detalle.component.css'
})
export class ProductoDetalleComponent implements OnInit {

  //producto: any={};
  producto: Producto | null = null
  comentarios: any[] = [];
  comentario: string = '';
  loading: boolean = false;

  private readonly HUGGING_FACE_API_URL = environment.HUGGING_FACE_API_URL;
  private readonly TOKEN = environment.TOKEN;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id')); // Gets the ID from the URL
    this.producto = ProductsData.find(p => p.id === id) || null; // Finds the product by ID or null if not found

    // Imprime el producto o un mensaje de error
    if (this.producto) {
      console.log('Producto encontrado:', this.producto); // Imprime el producto
    } else {
      console.error('Producto no encontrado');
    }

    this.obtenerComentarios();
    this.precalentarModelo();
  }

  precalentarModelo():void {
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${this.TOKEN}`)
    .set('Content-Type', 'application/json');

  this.http.post(this.HUGGING_FACE_API_URL, { inputs: "test" }, { headers })
    .subscribe(
      () => console.log('✅ Modelo precalentado correctamente'),
      (error) => console.error('⚠️ Error al precalentar el modelo:', error)
    );
  }

  obtenerComentarios(): void {
    const comentariosGuardados = localStorage.getItem('comentarios')
      ? JSON.parse(localStorage.getItem('comentarios')!)
      : [];

    if (this.producto) {
        this.comentarios = comentariosGuardados.filter((c: any) => c.idProducto === this.producto?.id);
    } else {
        this.comentarios = [];
    }
   // this.comentarios = comentariosGuardados;
  }
/*
  agregarComentario(): void {
    if (this.comentario.trim() === '') return;

    this.loading = true;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.TOKEN}`).set('Content-Type', 'application/json');

    this.http.post(this.HUGGING_FACE_API_URL, { inputs: this.comentario }, { headers })
      .subscribe(
        (response: any) => {
          const clasificaciones = response[0];
          const mejorClasificacion = clasificaciones.reduce((prev: any, current: any) =>
            prev.score > current.score ? prev : current
          );

          const nuevoComentario = {
            idcomentario: this.comentarios.length + 1,
            idProducto: this.producto?.id, // Asociar el comentario con el producto
            texto: this.comentario,
            classification: mejorClasificacion.label,
            score: mejorClasificacion.score
          };

          this.comentarios.push(nuevoComentario);
          localStorage.setItem('comentarios', JSON.stringify(this.comentarios));
          this.comentario = '';
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          console.error('Error al clasificar el comentario:', error.message);
          this.loading = false;
        }
      );
  }*/

  agregarComentario(): void {
        if (this.comentario.trim() === '') return;

        this.loading = true;
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.TOKEN}`).set('Content-Type', 'application/json');

        this.http.post(this.HUGGING_FACE_API_URL, { inputs: this.comentario }, { headers })
          .subscribe(
            (response: any) => {
              const clasificaciones = response[0];
              const mejorClasificacion = clasificaciones.reduce((prev: any, current: any) =>
                prev.score > current.score ? prev : current
              );

              const nuevoComentario = {
                idcomentario: Date.now(), // Usar timestamp para ID único
                idProducto: this.producto?.id, // Asociar el comentario con el producto
                texto: this.comentario,
                classification: mejorClasificacion.label,
                score: mejorClasificacion.score
              };

              const comentariosGuardados = localStorage.getItem('comentarios')
                ? JSON.parse(localStorage.getItem('comentarios')!)
                : [];

              comentariosGuardados.push(nuevoComentario);
              localStorage.setItem('comentarios', JSON.stringify(comentariosGuardados));

              // Filtrar comentarios nuevamente
              this.obtenerComentarios();
              this.comentario = '';
              this.loading = false;
            },
            (error: HttpErrorResponse) => {
              console.error('Error al clasificar el comentario:', error.message);
              this.loading = false;
            }
          );
 }

  getEstrellas(clasificacion: string): string {
        switch (clasificacion) {
          case 'Positivo':
            return '⭐⭐⭐⭐⭐'; // 5 estrellas
          case 'Neutro':
            return '⭐⭐⭐'; // 3 estrellas
          case 'Negativo':
            return '⭐'; // 1 estrella
          case 'Invalido':
            return '❌'; // Icono de inválido
          default:
            return ''; // No muestra nada si no hay clasificación
        }
  }


}

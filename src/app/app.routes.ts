import { Routes } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { ProductoDetalleComponent } from './components/producto-detalle/producto-detalle.component';

export const routes: Routes = [

  {path:'', component: CatalogoComponent},
  {path:'producto/:id', component: ProductoDetalleComponent}
];


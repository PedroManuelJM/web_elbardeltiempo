import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import { CatalogoComponent } from "./catalogo/catalogo.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // 🔹 Importa CommonModule
import { NavbarComponent } from './components/navbar/navbar.component';
//import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    NavbarComponent,
  //  HttpClientModule,
    FooterComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app-catalogo';
}

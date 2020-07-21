import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService, Plato } from '../services/menu.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  hamburguesas: Observable<any[]>;
  perros: Observable<any[]>;
  asados: Observable<any[]>;
  pizzas: Observable<any[]>;
  otros: Observable<any[]>;
  bebidas: Observable<any[]>;
  subtotal: number;

  constructor(private router: Router, private menuService: MenuService) {}

  ngOnInit(){
    this.subtotal = 0;
    this.hamburguesas = this.menuService.getMenu('hamburguesas');
    this.perros = this.menuService.getMenu('perros');
    this.asados = this.menuService.getMenu('asados');
    this.pizzas = this.menuService.getMenu('pizzas');
    this.otros = this.menuService.getMenu('otros');
    this.bebidas = this.menuService.getMenu('bebidas');
  }

  detail(item){
    console.log('Producto seleccionado', item);
  }

  pedir(){
    console.log('Hace el pedido');
  }
}

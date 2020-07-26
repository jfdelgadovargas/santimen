import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../services/menu.service';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { DetailmodalPage } from '../pages/detailmodal/detailmodal.page';
import { SummaryPage } from '../pages/summary/summary.page';

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
  categorias: Observable<any[]>;
  subtotal: number;
  canasta = [];
  totalProductos = 0;

  constructor(private router: Router,
              private menuService: MenuService,
              private modalCtrl: ModalController) {}

  ngOnInit(){
    this.subtotal = 0;
    // this.hamburguesas = this.menuService.getMenu('hamburguesas');
    // this.perros = this.menuService.getMenu('perros');
    // this.asados = this.menuService.getMenu('asados');
    // this.pizzas = this.menuService.getMenu('pizzas');
    // this.otros = this.menuService.getMenu('otros');
    // this.bebidas = this.menuService.getMenu('bebidas');
    this.categorias = this.menuService.getCategorias();
    let totalizer = JSON.parse(localStorage.getItem('totalizer'));
    if(totalizer == null){
      console.log('inicializa totalizer');
      localStorage.setItem('totalizer', JSON.stringify({
        canasta: this.canasta,
        subtotal: this.subtotal,
        totalProductos: this. totalProductos
      }));
    }else{
      this.canasta = totalizer.canasta;
      this.subtotal = totalizer.subtotal;
      this.totalProductos = totalizer.totalProductos;
    }
  }

  async detail(item){
    const modal = await this.modalCtrl.create({
      component: DetailmodalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion,
        precio: item.precio,
        imagen: item.imagen,
      }
    });

    await modal.present();

    const data = await modal.onDidDismiss();
    const productos = this.canasta.length;
    if(data.data){
      const seleccion = data.data;
      if(productos === 0){
        this.canasta.push(data.data);
        this.totalProductos += data.data.cantidad;
      }else{
        let blFind = false;
        for(let producto of this.canasta){
          if(seleccion.id === producto.id){
            blFind = true;
            producto.cantidad += seleccion.cantidad;
            producto.total += seleccion.total;
            this.totalProductos += seleccion.cantidad;
            break;
          }
        }
        if(blFind == false){
          this.canasta.push(seleccion);
          this.totalProductos += seleccion.cantidad;
        }
      }

      this.subtotal += data.data.total;
      console.log('Su carrito va así:', this.canasta);
    } 
  }

  async resumen(){
    console.log('Hace el pedido');
    const modalResumen = await this.modalCtrl.create({
      component: SummaryPage,
      cssClass: 'my-custom-class',
      componentProps: {
        canasta: this.canasta,
        totalProductos: this.totalProductos,
        subtotal: this.subtotal
      }
    });
    await modalResumen.present();
    const resumen = await modalResumen.onDidDismiss();
    const nuevosProductos = resumen.data;
    this.canasta = nuevosProductos.canasta;
    this.totalProductos = nuevosProductos.totalProductos;
    this.subtotal = nuevosProductos.subtotal;
  }

  goDetail(sectionName){
    this.router.navigate([`${sectionName}`]);
  }
}

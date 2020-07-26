import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuService } from 'src/app/services/menu.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DetailmodalPage } from '../detailmodal/detailmodal.page';

@Component({
  selector: 'app-hamburguesas',
  templateUrl: './hamburguesas.page.html',
  styleUrls: ['../../../theme/utilities.scss', './hamburguesas.page.scss'],
})
export class HamburguesasPage implements OnInit {
  hamburguesas: Observable<any[]>;
  subtotal: number;
  canasta = [];
  totalProductos = 0;
  constructor(private router: Router, private menuService: MenuService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.hamburguesas = this.menuService.getMenu('hamburguesas');
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
    if (data.data){
      const seleccion = data.data;
      if (productos === 0){
        this.canasta.push(data.data);
        this.totalProductos += data.data.cantidad;
      }else{
        let blFind = false;
        for (const producto of this.canasta){
          if (seleccion.id === producto.id){
            blFind = true;
            producto.cantidad += seleccion.cantidad;
            producto.total += seleccion.total;
            this.totalProductos += seleccion.cantidad;
            break;
          }
        }
        if (blFind === false){
          this.canasta.push(seleccion);
          this.totalProductos += seleccion.cantidad;
        }
      }

      this.subtotal += data.data.total;
      console.log('Su carrito va así:', this.canasta);
    }
  }
}

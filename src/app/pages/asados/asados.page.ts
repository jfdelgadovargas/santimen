import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { SummaryPage } from '../summary/summary.page';
import { DetailmodalPage } from '../detailmodal/detailmodal.page';

@Component({
  selector: 'app-asados',
  templateUrl: './asados.page.html',
  styleUrls: ['../../../theme/utilities.scss', './asados.page.scss'],
})
export class AsadosPage implements OnInit {
  asados: Observable<any[]>;
  subtotal: 0;
  canasta = [];
  totalProductos = 0;
  constructor(private router: Router,
              private menuService: MenuService,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.asados = this.menuService.getMenu('asados');
    let totalizer =  JSON.parse(localStorage.getItem('totalizer'));
    this.canasta = totalizer.canasta;
    this.totalProductos = totalizer.totalProductos;
    this.subtotal = totalizer.subtotal;
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
        opciones: this.menuService.getMenuDetail('asados', item.id)
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
      localStorage.setItem('totalizer', JSON.stringify({
        canasta: this.canasta,
        subtotal: this.subtotal,
        totalProductos: this. totalProductos
      }));
      console.log('Su carrito en asados:', this.canasta);
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
    localStorage.setItem('totalizer', JSON.stringify({
      canasta: this.canasta,
      subtotal: this.subtotal,
      totalProductos: this. totalProductos
    }));
  }


  atras(){
    this.router.navigate(['/home']);
  }

}

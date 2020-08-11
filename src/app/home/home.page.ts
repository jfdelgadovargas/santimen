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
  styleUrls: ['home.page.scss', '../../theme/utilities.scss'],
})
export class HomePage {
  categorias: Observable<any[]>;
  subtotal: number;
  canasta = [];
  totalProductos = 0;

  constructor(private router: Router,
              private menuService: MenuService,
              private modalCtrl: ModalController) {}

  /**
   * Método de inicialización de la vista encargado de la carga de categorías
   * e inicialización de variables en local storage.
   */
  ngOnInit(){
    this.subtotal = 0;
    this.categorias = this.menuService.getCategorias();
    const totalizer = JSON.parse(localStorage.getItem('totalizer'));
    const clienteID = JSON.parse(localStorage.getItem('clienteID'));
    const pedidos = JSON.parse(localStorage.getItem('pedidos'));
    if (totalizer == null){
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
    if (pedidos == null){
      localStorage.setItem('pedidos', JSON.stringify([]));
    }
    if (clienteID == null){
      localStorage.setItem('clienteID', JSON.stringify(''));
    }
  }

  /**
   * Muestra el detalle de los productos agregados a la canasta.
   */
  async resumen(){
    const modalResumen = await this.modalCtrl.create({
      component: SummaryPage,
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

  /**
   * Método que redirecciona a la lista de items de una categoría.
   * @param sectionName Nombre de la categoría que mostrará.
   */
  goDetail(sectionName){
    this.router.navigate([`/categoria/${sectionName}`]);
  }

  /**
   * Método para actualizar la vista home con la canasta después de entrar a la vista.
   */
  ionViewDidEnter(){
    const totalizer = JSON.parse(localStorage.getItem('totalizer'));
    this.canasta = totalizer.canasta;
    this.subtotal = totalizer.subtotal;
    this.totalProductos = totalizer.totalProductos;
  }

  /**
   * Método que direcciona a la vista de pedidos.
   */
  pedidos(){
    this.router.navigate([`/pedidos`]);
  }
}

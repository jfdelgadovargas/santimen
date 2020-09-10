import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../services/menu.service';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { DetailmodalPage } from '../pages/detailmodal/detailmodal.page';
import { SummaryPage } from '../pages/summary/summary.page';
import { ReservasPage } from '../pages/reservas/reservas.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', '../../theme/utilities.scss', '../../theme/carta.scss'],
})
export class HomePage {
  categorias: Observable<any[]>;
  subtotal: number;
  canasta = [];
  totalProductos = 0;
  configuraciones: Observable<any[]>;
  horaApertura;
  textoHorario = '';
  textoIntro = '';
  textoCarta = '';
  abierto = false;
  whatsapp = false;
  modo;
  reservas = false;
  numeroWapp;
  mensajeWapp;
  datosCarta = [];
  imagenHeader = '';
  logo = '';
  css = 1;

  constructor(private router: Router,
              private menuService: MenuService,
              private modalCtrl: ModalController) {}

  /**
   * Método de inicialización de la vista encargado de la carga de categorías
   * e inicialización de variables en local storage.
   */
  ngOnInit(){
    if (!window.location.hash) {
      window.location.href = window.location + '#loaded';
      window.location.reload();
    }
    this.subtotal = 0;
    this.menuService.getCategorias().subscribe(elemento => {
      for (const categoria of elemento){
        const productos = this.menuService.getMenu(categoria.nombre).subscribe(datos => {
          for (const producto of datos){
            producto.opcionesCarta.sort((a, b) => {
              return (a.precio - b.precio);
            });
          }
          const objeto = {
            display: categoria.display,
            subtitulo: categoria.subtitulo,
            displayCarta: categoria.displayCarta,
            blSubtitulo: categoria.blSubtitulo,
            productos: datos
          };
          this.datosCarta.push(objeto);
       });
      }
    });
    this.categorias = this.menuService.getCategorias();
    this.menuService.getConfiguracion('configuracion').subscribe(configuracion => {
      if (configuracion){
        const data = configuracion.payload.data();
        this.configuraciones = data;
        this.horaApertura = data.horaApertura;
        this.textoHorario = data.textoHorario;
        this.textoIntro = data.textoIntro;
        this.textoCarta = data.textoCarta;
        this.abierto = data.abierto;
        this.modo = data.modo;
        this.reservas = data.reservas;
        this.whatsapp = data.whatsapp;
        this.numeroWapp = data.numeroWapp;
        this.mensajeWapp = data.mensajeWapp;
        this.imagenHeader = data.imagenHeader;
        this.logo = data.logo;
        this.css = data.css;
      }
    });
    const totalizer = JSON.parse(localStorage.getItem('totalizer'));
    const clienteID = JSON.parse(localStorage.getItem('clienteID'));
    const pedidos = JSON.parse(localStorage.getItem('pedidos'));
    if (totalizer == null){
      localStorage.setItem('totalizer', JSON.stringify({
        canasta: this.canasta,
        subtotal: this.subtotal
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

  async goReservas(){
    const modalReserva = await this.modalCtrl.create({
      component: ReservasPage,
      componentProps: {
      }
    });
    await modalReserva.present();
  }

  contactar(){
    window.open(`https://wa.me/${this.numeroWapp}?text=${this.mensajeWapp}`);
  }
}

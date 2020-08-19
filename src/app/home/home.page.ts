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
  hamburguesas: Observable<any[]>;
  imagenHamburguesas;
  perros: Observable<any[]>;
  imagenPerros;
  pizzas: Observable<any[]>;
  imagenPizzas;
  bebidas: Observable<any[]>;
  imagenBebidas;
  combos: Observable<any[]>;
  imagenCombos;
  otros: Observable<any[]>;
  imagenOtros;
  asados: Observable<any[]>;
  imagenAsados;
  numeroWapp;
  mensajeWapp;

  constructor(private router: Router,
              private menuService: MenuService,
              private modalCtrl: ModalController) {}

  /**
   * Método de inicialización de la vista encargado de la carga de categorías
   * e inicialización de variables en local storage.
   */
  ngOnInit(){
    this.subtotal = 0;
    this.menuService.getCategorias().subscribe(elemento => {
      const Hamburguesa = elemento.find(nombre => nombre.nombre === 'hamburguesas');
      this.imagenHamburguesas = Hamburguesa.displayCarta;
      const Perro = elemento.find(nombre => nombre.nombre === 'perros');
      this.imagenPerros = Perro.displayCarta;
      const Pizza = elemento.find(nombre => nombre.nombre === 'pizzas');
      this.imagenPizzas = Pizza.displayCarta;
      const Bebida = elemento.find(nombre => nombre.nombre === 'bebidas');
      this.imagenBebidas = Bebida.displayCarta;
      const Otro = elemento.find(nombre => nombre.nombre === 'otros');
      this.imagenOtros = Otro.displayCarta;
      const Asado = elemento.find(nombre => nombre.nombre === 'asados');
      this.imagenAsados = Asado.displayCarta;
      const Combo = elemento.find(nombre => nombre.nombre === 'combos');
      this.imagenCombos = Combo.displayCarta;
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
    this.hamburguesas = this.menuService.getMenu('hamburguesas');
    this.perros = this.menuService.getMenu('perros');
    this.pizzas = this.menuService.getMenu('pizzas');
    this.bebidas = this.menuService.getMenu('bebidas');
    this.otros = this.menuService.getMenu('otros');
    this.asados = this.menuService.getMenu('asados');
    this.combos = this.menuService.getMenu('combos');
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

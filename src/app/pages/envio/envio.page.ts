import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-envio',
  templateUrl: './envio.page.html',
  styleUrls: ['./envio.page.scss'],
})
export class EnvioPage implements OnInit {
  pedido;
  totalEnvio;
  total;
  loading: any;
  cancelLoading: any;
  pedidoID;
  granTotal = 0;
  blTextoEspera = false;
  constructor(private router: Router,
              private menuService: MenuService,
              private activatedRoute: ActivatedRoute,
              private loadingController: LoadingController,) { }
  /**
   * Método de inicialización de la vista encargado de cargar el detalle de un pedido.
   */
  ngOnInit() {
    const pedidoID = this.activatedRoute.snapshot.paramMap.get('pedidoID');
    if (pedidoID){
      this.menuService.getPedidoDetail(pedidoID).subscribe(respuesta => {
        this.pedidoID = respuesta.payload.id;
        const pedido = respuesta.payload.data();
        this.pedido = pedido;
        this.blTextoEspera = pedido.totalCostoEnvio;
        this.totalEnvio = pedido.totalCostoEnvio;
        this.total = pedido.total;
        this.granTotal = this.total + this.totalEnvio;
      });
    }else{
      this.router.navigate(['/home']);
    }
  }

  /**
   * Método encargado de cambiar el estado del pedido
   * y redireccionar a la vista de home.
   */
  cancelarPedido(){
    this.cancelarLoading();
    this.menuService.cancelarPedido(this.pedidoID).then(docRef => {
      this.cancelLoading.dismiss();
      this.router.navigate(['/home']);
    }).catch(e => console.log(e));
    this.router.navigate(['/home']);
  }

  /**
   * Método encargado de cambiar el estado del pedido y redireccionar
   * a la vista de pedidos.
   */
  confirmarPedido(){
    if (!this.blTextoEspera){
      return;
    }
    this.presentLoading();
    this.menuService.aceptarPedido(this.pedidoID).then(docRef => {
      this.loading.dismiss();
      this.router.navigate(['/pedidos']);
    }).catch(e => console.log(e));
  }

  /**
   * Método encargado de mostrar mensaje de espera para cancelar el pedido.
   */
  async cancelarLoading() {
    this.cancelLoading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Por favor, espere mientras se cancela su pedido.'
    });
    return this.cancelLoading.present();
  }

  /**
   * Método encargado de mostrar mensaje de espera para registrar el pedido.
   */
  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Por favor, espere mientras se registra su pedido.'
    });
    return this.loading.present();
  }

}

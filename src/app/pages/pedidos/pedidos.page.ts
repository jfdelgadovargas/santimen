import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';
import { ModalController } from '@ionic/angular';
import { PedidodetailPage } from '../pedidodetail/pedidodetail.page';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {
  pedidos: any;
  estado: any;
  blPedidos = false;
  constructor(private router: Router,
              private modalCtrl: ModalController,
              private menuService: MenuService) { }

  ngOnInit() {
    const clienteID = JSON.parse(localStorage.getItem('clienteID'));
    if (!clienteID){
      this.blPedidos = false;
      return;
    }
    this.menuService.getPedidos(clienteID).subscribe(pedidos => {
      this.pedidos = pedidos;
      this.blPedidos = this.pedidos.length === 0 ? false : true;
      for (const pedido of pedidos){
        pedido.total = pedido.modoEnvio === 'domicilio' ? pedido.total + pedido.totalCostoEnvio : pedido.total;
        pedido.textoProductos = pedido.totalProductos > 1 ? 'Productos' : 'Producto';
        switch (pedido.estado) {
          case 0:
            pedido.textoEstado = 'Pendiente';
            break;

          case 1:
            pedido.textoEstado = 'Confirmado';
            break;

          case 2:
            pedido.textoEstado = 'En camino';
            break;

          case 3:
            pedido.textoEstado = 'Listo';
            break;

          case 4:
            pedido.textoEstado = 'Listo';
            break;

          case 5:
            pedido.textoEstado = 'Entregado';
            break;

          case 7:
            pedido.textoEstado = 'Cancelado';
            break;

          default:
            pedido.textoEstado = 'Pendiente';
            pedido.estadoImg =  `../../../assets/images/recibido.svg`;
            break;
      }
    }
    });
  }

  async mostrarDetalle(pedidoID){
    const modal = await this.modalCtrl.create({
      component: PedidodetailPage,
      cssClass: 'my-custom-class',
      componentProps: {
        pedidoID
      }
    });
    await modal.present();
  }

  home(){
    this.router.navigate(['/home']);
  }


}

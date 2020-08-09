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
  estadoImg;
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
        pedido.textoProductos = pedido.totalProductos > 1 ? 'Productos' : 'Producto';
        switch (pedido.estado) {
          case 0:
            pedido.textoEstado = 'Pendiente';
            pedido.estadoImg =  `../../../assets/images/recibido.svg`;
            break;

          case 1:
            pedido.textoEstado = 'Aceptado';
            pedido.estadoImg =  `../../../assets/images/aceptado.svg`;
            break;

          case 2:
            pedido.textoEstado = 'En camino';
            pedido.estadoImg =  `../../../assets/images/entregando.svg`;
            break;

          case 3:
            pedido.textoEstado = 'Listo';
            pedido.estadoImg =  `../../../assets/images/entregando.svg`;
            break;

          case 4:
            pedido.textoEstado = 'Listo';
            pedido.estadoImg =  `../../../assets/images/entregando.svg`;
            break;

          default:
            pedido.textoEstado = 'Pendiente';
            pedido.estadoImg =  `../../../assets/images/recibido.svg`;
            break;
      }
    }
    });
  }

  async mostrarDetalle(pedido){
    const modal = await this.modalCtrl.create({
      component: PedidodetailPage,
      cssClass: 'my-custom-class',
      componentProps: {
        pedido
      }
    });
    await modal.present();
  }

  home(){
    this.router.navigate(['/home']);
  }


}

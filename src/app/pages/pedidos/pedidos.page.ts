import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {

  pedido: any;
  estado;
  blRecibido = false;
  blAceptado = false;
  blEntregando = false;
  blLugar = false;
  blMesa = false;
  urlSuccess = '../../../assets/images/success.svg';
  urlPendiente = '../../../assets/images/pendiente.svg';
  urlIcono = '../../../assets/images/recibido.svg';
  urlRecibido;
  urlAceptado;
  urlEntregando;
  urlLugar;
  urlMesa;
  texto = 'Tu orden ha sido recibida y está pendiente por confirmar.';
  constructor(private router: Router,
              private menuService: MenuService) { }

  ngOnInit() {
    this.urlRecibido = this.urlPendiente;
    this.urlAceptado = this.urlPendiente;
    this.urlEntregando = this.urlPendiente;
    this.urlLugar = this.urlPendiente;
    this.urlMesa = this.urlPendiente;
    const pedidoActual = JSON.parse(localStorage.getItem('pedidoActual'));
    if (!pedidoActual){
      console.log('No hay pedidos');
      return;
    }
    this.menuService.getPedidoDetail(pedidoActual).subscribe(pedido => {
      this.pedido = pedido.payload.data().pedido;
      switch (this.pedido) {
        case 0:
          this.estado = 'recibido';
          this.texto = 'Tu orden ha sido recibida y está pendiente por confirmar.';
          this.blRecibido = true;
          this.blAceptado = false;
          this.blEntregando = false;
          this.blLugar = false;
          this.blMesa = false;
          this.urlRecibido = this.urlSuccess;
          this.urlAceptado = this.urlPendiente;
          this.urlEntregando = this.urlPendiente;
          this.urlLugar = this.urlPendiente;
          this.urlMesa = this.urlPendiente;
          break;

        case 1:
        this.estado = 'aceptado';
        this.texto = 'El restaurante confirmó tu pedido.';
        this.blRecibido = true;
        this.blAceptado = true;
        this.blEntregando = false;
        this.blLugar = false;
        this.blMesa = false;
        this.urlRecibido = this.urlSuccess;
        this.urlAceptado = this.urlSuccess;
        this.urlEntregando = this.urlPendiente;
        this.urlLugar = this.urlPendiente;
        this.urlMesa = this.urlPendiente;
        break;
        
        case 2:
        this.estado = 'entregando';
        this.texto = 'Tu pedido ya está en camino.';
        this.blRecibido = true;
        this.blAceptado = true;
        this.blEntregando = true;
        this.blLugar = false;
        this.blMesa = false;
        this.urlRecibido = this.urlSuccess;
        this.urlAceptado = this.urlSuccess;
        this.urlEntregando = this.urlSuccess;
        this.urlLugar = this.urlPendiente;
        this.urlMesa = this.urlPendiente;
        break;
        
        case 3:
        this.estado = 'lugar';
        this.texto = 'Tu pedido ya está listo.';
        this.blRecibido = true;
        this.blAceptado = true;
        this.blEntregando = true;
        this.blLugar = true;
        this.blMesa = false;
        this.urlRecibido = this.urlSuccess;
        this.urlAceptado = this.urlSuccess;
        this.urlEntregando = this.urlPendiente;
        this.urlLugar = this.urlSuccess;
        this.urlMesa = this.urlPendiente;
        break;

        case 4:
          this.estado = 'mesa';
          this.texto = 'Ya puedes reclamar tu pedido.';
          this.blRecibido = true;
          this.blAceptado = true;
          this.blEntregando = true;
          this.blLugar = false;
          this.blMesa = true;
          this.urlRecibido = this.urlSuccess;
          this.urlAceptado = this.urlSuccess;
          this.urlEntregando = this.urlPendiente;
          this.urlLugar = this.urlPendiente;
          this.urlMesa = this.urlSuccess;
          break;

        default:
          this.estado = 'recibido';
          this.blRecibido = true;
          this.blAceptado = false;
          this.blEntregando = false;
          this.blLugar = false;
          this.blMesa = false;
          this.urlRecibido = this.urlSuccess;
          this.urlAceptado = this.urlPendiente;
          this.urlEntregando = this.urlPendiente;
          this.urlLugar = this.urlPendiente;
          this.urlMesa = this.urlPendiente;
          break;
      }
      this.urlIcono = `../../../assets/images/${this.estado}.svg`;
    });
  }

  home(){
    this.router.navigate(['/home']);
  }


}

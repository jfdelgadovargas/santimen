import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pedidodetail',
  templateUrl: './pedidodetail.page.html',
  styleUrls: ['./pedidodetail.page.scss'],
})
export class PedidodetailPage implements OnInit {
  @Input() pedido;
  estadoImg;
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
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.pedido);
    this.urlRecibido = this.urlPendiente;
    this.urlAceptado = this.urlPendiente;
    this.urlEntregando = this.urlPendiente;
    this.urlLugar = this.urlPendiente;
    this.urlMesa = this.urlPendiente;
    switch (this.pedido.estado) {
      case 0:
        this.estadoImg = 'recibido';
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
      this.estadoImg = 'aceptado';
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
      this.estadoImg = 'entregando';
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
      this.estadoImg = 'lugar';
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
        this.estadoImg = 'mesa';
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
        this.estadoImg = 'recibido';
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
    this.urlIcono = `../../../assets/images/${this.estadoImg}.svg`;
  }

  cerrarDetalle(){
    this.modalCtrl.dismiss();
  }

}

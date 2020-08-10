import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-pedidodetail',
  templateUrl: './pedidodetail.page.html',
  styleUrls: ['./pedidodetail.page.scss'],
})
export class PedidodetailPage implements OnInit {
  @Input() pedidoID;
  pedido: any;
  estadoImg;
  blRecibido = false;
  blAceptado = false;
  blEntregando = false;
  blLugar = false;
  blMesa = false;
  blDomicilio = false;
  urlSuccess = '../../../assets/images/success.svg';
  urlPendiente = '../../../assets/images/pendiente.svg';
  urlIcono = '../../../assets/images/recibido.svg';
  urlRecibido;
  urlAceptado;
  urlEntregando;
  urlLugar;
  urlMesa;
  imgProductos;
  totalProductos;
  textoProductos;
  total;
  nombreForm;
  telefonoForm;
  direccionForm1;
  direccionForm2;
  formaPago;
  metodoEntrega;
  texto = 'Tu orden ha sido recibida y está pendiente por confirmar.';
  constructor(private modalCtrl: ModalController, 
              private menuService: MenuService) { }

  ngOnInit() {
    this.menuService.getPedidoDetail(this.pedidoID).subscribe(respuesta => {
      const pedido = respuesta.payload.data();
      this.totalProductos = pedido.totalProductos;
      this.textoProductos = pedido.textoProductos;
      this.total = pedido.total;
      this.nombreForm = pedido.nombreForm;
      this.telefonoForm = pedido.telefonoForm;
      this.direccionForm1 = pedido.direccionForm1;
      this.direccionForm2 = pedido.direccionForm2;
      this.formaPago = pedido.formaPago;
      this.pedido = pedido;
      this.imgProductos = this.pedido.canasta[0].imagen;
      this.urlRecibido = this.urlPendiente;
      this.urlAceptado = this.urlPendiente;
      this.urlEntregando = this.urlPendiente;
      this.urlLugar = this.urlPendiente;
      this.urlMesa = this.urlPendiente;
      this.DefinirMedioEntrega();
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
    });
  }

  cerrarDetalle(){
    this.modalCtrl.dismiss();
  }

  DefinirMedioEntrega(){
    this.blDomicilio = this.pedido.modoEnvio === 'domicilio';
    switch (this.pedido.modoEnvio) {
      case 'domicilio':
        this.pedido.metodoEntrega = 'Domicilio';
        break;

      case 'autoservicio':
        this.pedido.metodoEntrega = 'Retiro en el sitio';
        break;

      case 'lugar':
          this.pedido.metodoEntrega = `Consumo en lugar (Mesa ${this.pedido.mesaForm})`;
          break;

      default:
        this.pedido.metodoEntrega = 'Domicilio';
        break;
    }
  }

}

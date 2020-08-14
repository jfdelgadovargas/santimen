import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OpcionespagomodalPage } from '../opcionespagomodal/opcionespagomodal.page';
import { ModalController, LoadingController } from '@ionic/angular';
import { MenuService } from 'src/app/services/menu.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PedidodetailPage } from '../pedidodetail/pedidodetail.page';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-opcionespago',
  templateUrl: './opcionespago.page.html',
  styleUrls: ['./opcionespago.page.scss'],
})
export class OpcionespagoPage implements OnInit {
  subtotal: number;
  canasta = [];
  totalProductos = 0;
  blDomicilio = true;
  blMesa = false;
  blNombre = true;
  blTelefono = true;
  blDireccion = true;
  opcionEnvio = 'domicilio';
  costoEnvio = 0;
  total = 0;
  blDisabled = true;
  nombreForm;
  direccionForm1;
  direccionForm2;
  telefonoForm;
  mesaForm;
  modoEnvio = 'domicilio';
  opcionPago = 'efectivo';
  url;
  ayuda = '';
  display = 'Efectivo';
  loading;

  /**
   * Variables para validar el formulario
   */
  blFormValido = false;
  blNombreValido = false;
  blDireccionValido = false;
  blTelefonoValido = false;
  blMesaValido = false;
  clienteID;
  configuraciones: Observable<any[]>;
  horaApertura;
  textoHorario = '';
  textoIntro = '';
  abierto = false;
  modo;

  constructor(private router: Router,
              private modalCtrl: ModalController,
              private loadingController: LoadingController,
              private menuService: MenuService) { }

  /**
   * Métodode inicialización de la vista, encargado de iniciar loas variables de la canasta.
   */
  ngOnInit() {
    this.menuService.getConfiguracion('configuracion').subscribe(configuracion => {
      if (configuracion){
        const data = configuracion.payload.data();
        this.configuraciones = data;
        this.horaApertura = data.horaApertura;
        this.textoHorario = data.textoHorario;
        this.textoIntro = data.textoIntro;
        this.abierto = data.abierto;
        this.modo = data.modo;
      }
    });
    this.url = '../../../assets/images/efectivo.svg';
    const totalizer = JSON.parse(localStorage.getItem('totalizer'));
    this.clienteID = JSON.parse(localStorage.getItem('clienteID'));
    this.canasta = totalizer.canasta;
    this.subtotal = totalizer.subtotal;
    this.totalProductos = totalizer.totalProductos;
    this.total = this.subtotal + this.costoEnvio;
  }

  /**
   * Método que direcciona a la vista del home.
   */
  atras(){
    this.router.navigate(['/home']);
  }

  /**
   * Método que escucha el cambio en la opción de entrega del pedido.
   * Evalua el modo de envío para mostrar el estado de cada pedido.
   * @param opcion Opción del tipo de netrega del pedido.
   */
  seleccionarEnvio(opcion){
    const modoEnvio = opcion.detail.value;
    if (!modoEnvio){
      this.blDomicilio = true;
      this.modoEnvio = modoEnvio;
      return;
    }
    this.modoEnvio = modoEnvio;
    switch (modoEnvio) {
      case 'domicilio':
        this.blMesa = false;
        this.blNombre = true;
        this.blTelefono = true;
        this.blDireccion = true;
        this.validaFormulario();
        break;

      case 'autoservicio':
        this.blMesa = false;
        this.blNombre = true;
        this.blTelefono = true;
        this.blDireccion = false;
        this.validaFormulario();
        break;

      case 'lugar':
        this.blMesa = true;
        this.blNombre = true;
        this.blTelefono = false;
        this.blDireccion = false;
        this.validaFormulario();
        break;

      default:
        this.blMesa = false;
        this.blNombre = true;
        this.blTelefono = true;
        this.blDireccion = true;
        this.validaFormulario();
        break;
    }
    this.blDomicilio = modoEnvio === 'domicilio';
    this.blMesa = modoEnvio === 'lugar';
    this.total = this.blDomicilio ? this.subtotal + this.costoEnvio : this.subtotal;
  }

  /**
   * Método encargado de registrar el pedido en la BD.
   */
  async Enviarpedido(){
    if (this.blDisabled || this.modo === 1 || this.abierto === false){
      return;
    }
    this.presentLoading();
    this.menuService.registrarPedido({
      canasta: this.canasta,
      total: this.total,
      totalProductos: this.totalProductos,
      estado: this.modoEnvio === 'domicilio' ? 6 : 0,
      modoEnvio: this.modoEnvio,
      nombreForm : this.nombreForm,
      baseCostoEnvio: this.costoEnvio,
      totalCostoEnvio: 0,
      direccionForm1 : this.direccionForm1 === undefined ? '' : this.direccionForm1,
      direccionForm2 : this.direccionForm2 === undefined ? '' : this.direccionForm2,
      telefonoForm : this.telefonoForm === undefined ? '' : this.telefonoForm,
      mesaForm : this.mesaForm === undefined ? '' : this.mesaForm,
      formaPago: this.display,
      clienteID: this.clienteID
    }).then(docRef => {
      this.loading.dismiss();
      const totalizer = JSON.parse(localStorage.getItem('totalizer'));
      const pedidos = JSON.parse(localStorage.getItem('pedidos'));
      if (!this.clienteID){
        if(docRef){
          localStorage.setItem('clienteID', JSON.stringify(docRef.id));
          totalizer.pedidoID = docRef.id;
        }
      }
      pedidos.push(totalizer);
      localStorage.setItem('totalizer', JSON.stringify(totalizer));
      localStorage.setItem('pedidos', JSON.stringify(pedidos));
      this.vaciarCanasta();
      if (this.modoEnvio === 'domicilio'){
        if (docRef){
          this.router.navigate([`/envio/${docRef.id}`]);
        }
      }else{
        this.router.navigate(['/pedidos']);
      }
    })
    .catch(e => {
      console.log('Se presentó un error', e);
    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Por favor, espere mientras se registra su pedido.'
    });
    return this.loading.present();
  }


  validaFormulario(){
    this.blNombreValido = this.nombreForm !== undefined && this.nombreForm !== '';
    this.blDireccionValido = this.direccionForm1 !== undefined && this.direccionForm1 !== '';
    this.blTelefonoValido = this.telefonoForm !== undefined && this.telefonoForm !== '';
    this.blMesaValido = this.mesaForm !== undefined && this.mesaForm !== null;

    switch (this.modoEnvio) {
      case 'domicilio':
        this.validaFormDomicilio();
        break;

      case 'autoservicio':
        this.validaFormAutoservicio();
        break;

      case 'lugar':
        this.validaFormLugar();
        break;

      default:
        this.validaFormDomicilio();
        break;
    }
  }

  validaFormDomicilio(){
    if (this.blNombreValido === true &&
        this.blDireccionValido === true &&
        this.blTelefonoValido === true){
          this.blFormValido = true;
          this.blDisabled = false;
        }else{
          this.blFormValido = false;
          this.blDisabled = true;
    }
  }

  validaFormAutoservicio(){
    if (this.blNombreValido === true &&
      this.blTelefonoValido === true){
        this.blFormValido = true;
        this.blDisabled = false;
      }else{
        this.blFormValido = false;
        this.blDisabled = true;
  }
  }

  validaFormLugar(){
    if (this.blNombreValido === true &&
      this.blMesaValido === true){
        this.blFormValido = true;
        this.blDisabled = false;
      }else{
        this.blFormValido = false;
        this.blDisabled = true;
  }
  }

  async cambiarMetodoPago(){
    const modal = await this.modalCtrl.create({
      component: OpcionespagomodalPage,
      cssClass: 'opciones-pago-lista',
      componentProps: {
        opcionPago: this.opcionPago,
        url: this.url,
        display: this.display,
        ayuda: this.ayuda,
        total: this.total
      }
    });
    await modal.present();

    const data = await modal.onDidDismiss();
    const seleccion = data.data;
    this.opcionPago = seleccion.opcionPago;
    this.url = seleccion.url;
    this.display = seleccion.display;
    this.ayuda = seleccion.ayuda;
  }

  /**
   * Elimina los productos de la canasta
   */
  vaciarCanasta(){
    this.canasta = [];
    this.subtotal = 0;
    this.totalProductos = 0;
    localStorage.setItem('totalizer', JSON.stringify({
      canasta: this.canasta,
      subtotal: this.subtotal,
      totalProductos: this. totalProductos
    }));
  }

}


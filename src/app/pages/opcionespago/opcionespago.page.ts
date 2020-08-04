import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';

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
  costoEnvio = 10000;
  total = 0;
  blDisabled = true;
  nombreForm;
  direccionForm1;
  direccionForm2;
  telefonoForm;
  mesaForm;
  modoEnvio = 'domicilio';

  /**
   * Variables para validar el formulario
   */
  blFormValido = false;
  blNombreValido = false;
  blDireccionValido = false;
  blTelefonoValido = false;
  blMesaValido = false;


  constructor(private router: Router,) { }

  ngOnInit() {
    const totalizer = JSON.parse(localStorage.getItem('totalizer'));
    this.canasta = totalizer.canasta;
    this.subtotal = totalizer.subtotal;
    this.totalProductos = totalizer.totalProductos;
    this.total = this.subtotal + this.costoEnvio;
  }

  atras(){
    this.router.navigate(['/home']);
  }

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
        this.validaFormulario()
        break;

      case 'autoservicio':
        this.blMesa = false;
        this.blNombre = true;
        this.blTelefono = true;
        this.blDireccion = false;
        this.validaFormulario()
        break;

      case 'lugar':
        this.blMesa = true;
        this.blNombre = true;
        this.blTelefono = false;
        this.blDireccion = false;
        this.validaFormulario()
        break;

      default:
        this.blMesa = false;
        this.blNombre = true;
        this.blTelefono = true;
        this.blDireccion = true;
        this.validaFormulario()
        break;
    }
    this.blDomicilio = modoEnvio === 'domicilio';
    this.blMesa = modoEnvio === 'lugar';
    this.total = this.blDomicilio ? this.subtotal + this.costoEnvio : this.subtotal;
  }

  Enviarpedido(){
    if (this.blDisabled){
      return;
    }
    console.log('Enviar pedido');
  }

  validaFormulario(){
    this.blNombreValido = this.nombreForm !== undefined && this.nombreForm !== '';
    this.blDireccionValido = this.direccionForm1 !== undefined && this.direccionForm1 !== '';
    this.blTelefonoValido = this.telefonoForm !== undefined && this.telefonoForm !== '';
    this.blMesaValido = this.mesaForm !== undefined && this.mesaForm !== '';

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

}


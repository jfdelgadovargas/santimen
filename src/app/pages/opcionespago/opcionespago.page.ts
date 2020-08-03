import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
      return;
    }
    switch (modoEnvio) {
      case 'domicilio':
        this.blMesa = false;
        this.blNombre = true;
        this.blTelefono = true;
        this.blDireccion = true;
        break;

      case 'autoservicio':
        this.blMesa = false;
        this.blNombre = true;
        this.blTelefono = true;
        this.blDireccion = false;
        break;

      case 'lugar':
        this.blMesa = true;
        this.blNombre = true;
        this.blTelefono = false;
        this.blDireccion = false;
        break;

      default:
        this.blMesa = false;
        this.blNombre = true;
        this.blTelefono = true;
        this.blDireccion = true;
        break;
    }
    this.blDomicilio = modoEnvio === 'domicilio';
    this.blMesa = modoEnvio === 'lugar';
    this.total = this.blDomicilio ? this.subtotal + this.costoEnvio : this.subtotal;
  }

  Enviarpedido(){
    console.log('Enviar pedido');
  }

}


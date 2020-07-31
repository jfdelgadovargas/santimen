import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detailmodal',
  templateUrl: './detailmodal.page.html',
  styleUrls: ['./detailmodal.page.scss'],
})
export class DetailmodalPage implements OnInit {
  @Input() id;
  @Input() nombre;
  @Input() descripcion;
  @Input() imagen;
  @Input() precio;
  @Input() opciones;
  
  subtotal;
  cantidad = 1;
  seleccion;
  arrOpciones = [];
  blOpciones = false;
  
  constructor(private modalCtrl: ModalController) { }
  
  ngOnInit() {
    this.subtotal = this.precio;
    this.opciones.subscribe(opciones => {
      this.seleccion = opciones[0].id;
      this.arrOpciones = opciones;
      this.blOpciones = opciones.length > 1;
      return opciones;
    });
  }

  cerrar(blPide){
    if(blPide){
      // console.log('cierra', this.seleccion);
      this.modalCtrl.dismiss({
      cantidad: this.cantidad * 1,
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      imagen: this.imagen,
      precio: this.precio,
      opciones: this.opciones,
      opcionSeleccionada: this.seleccion,
      total: this.subtotal
      });
    }else{
      this.modalCtrl.dismiss();
    }
    this.cantidad = 1;
  }

  seleccionaCantidad($event){
    this.subtotal = this.precio * $event.detail.value;
    this.cantidad = $event.detail.value;
    }

    restar(){
      if(this.cantidad === 1){
        return;
      }
      this.cantidad -= 1;
      this.subtotal = this.precio * this.cantidad;
    }
    adicionar(){
      this.cantidad += 1;
      this.subtotal = this.precio * this.cantidad;
    }

    seleccionar(id){
      this.seleccion = id.detail.value;
      // console.log('Seleccion en seleccionar()', this.seleccion);
      for (const item of this.arrOpciones){
        if (item.id === this.seleccion){
          this.precio = item.precio;
          this.subtotal = this.precio * this.cantidad;
        }
      }
    }
}

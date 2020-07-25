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
  
  constructor(private modalCtrl: ModalController) { }
  
  ngOnInit() {
    this.subtotal = this.precio;
  }

  cerrar(blPide){
    if(blPide){
      this.modalCtrl.dismiss({
      cantidad: this.cantidad * 1,
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      imagen: this.imagen,
      precio: this.precio,
      opciones: this.opciones,
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
}

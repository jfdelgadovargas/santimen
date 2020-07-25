import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {
  @Input() canasta;
  @Input() totalProductos;
  @Input() subtotal;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.canasta);
  }

  cerrar(){
    this.modalCtrl.dismiss({
      canasta: this.canasta,
      totalProductos: this.totalProductos,
      subtotal: this.subtotal
    });
  }

  adicionar(id){
    for(let producto of this.canasta){
      if(id === producto.id){
        producto.cantidad += 1;
        producto.total += producto.precio;
        this.totalProductos += 1;
        this.subtotal += producto.precio;
        break;
      }
    }
  }

  removerProducto(id){
    for(let [i, producto] of this.canasta.entries()){
      if(id === producto.id){
        this.subtotal -= producto.total;
        this.totalProductos -= producto.cantidad;
        this.canasta.splice(i, 1);
      }
    }
    if(this.canasta.length === 0){
      this.cerrar();
    }
  }

  restar(id, cantidad){
    if(cantidad === 1){
      return;
    }
    for(let producto of this.canasta){
      if(id === producto.id){
        producto.cantidad -= 1;
        producto.total -= producto.precio;
        this.totalProductos -= 1;
        this.subtotal -= producto.precio;
        break;
      }
    }
  }

  pedir(){
    console.log('Hace el pedido');
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {
  @Input() canasta;
  @Input() totalProductos;
  @Input() subtotal;
  constructor(private router: Router, private modalCtrl: ModalController, public alertCtrl: AlertController) { }

  ngOnInit() {
    console.log('canasta', this.canasta);
    this.organizarCanasta();
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
    this.actualizarCanasta();
  }

  adicionarMultiple(idProducto, idOpcion){
    for (const producto of this.canasta){
      if (idProducto === producto.id){
        producto.cantidad += 1;
        this.totalProductos += 1;
        for (const opcion of producto.arOpciones){
          if (idOpcion === opcion.id){
            producto.total += opcion.precio;
            this.subtotal += opcion.precio;
            opcion.cantidad += 1;
            break;
          }
        }
        break;
      }
    }
    this.actualizarCanasta();
  }

  removerProducto(id){
    for(let [i, producto] of this.canasta.entries()){
      if(id === producto.id){
        this.subtotal -= producto.total;
        this.totalProductos -= producto.cantidad;
        this.canasta.splice(i, 1);
      }
    }
    this.actualizarCanasta();
    if(this.canasta.length === 0){
      this.cerrar();
    }
  }

  removerOpcion(idProducto, cantidadProducto,  idOpcion){
    if (cantidadProducto === 1){
      console.log('Eliminar el producto');
      for (const [i, producto] of this.canasta.entries()){
        if (idProducto === producto.id){
          this.subtotal -= producto.total;
          this.totalProductos -= producto.cantidad;
          this.canasta.splice(i, 1);
        }
      }
    }else{
      for (const [i, producto] of this.canasta.entries()){
        if (idProducto === producto.id){
          for (const [j, opcion] of producto.arOpciones.entries()){
            if (idOpcion === opcion.id){
              producto.total -= opcion.precio;
              producto.cantidad -= opcion.cantidad;
              this.subtotal -= opcion.precio;
              this.totalProductos -= opcion.cantidad;
              producto.arOpciones.splice(j, 1);
              break;
            }
          }
          break;
        }
      }
    }
    this.actualizarCanasta();
    if (this.canasta.length === 0){
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
    this.actualizarCanasta();
  }

  restarMultiple(idProducto, idOpcion, cantidadProducto, cantidadOpcion){
    if (cantidadOpcion === 1){
      return;
    }
    for (const producto of this.canasta){
      if (idProducto === producto.id){
        producto.cantidad -= 1;
        this.totalProductos -= 1;
        for (const opcion of producto.arOpciones){
          if (opcion.id === idOpcion){
            producto.total -= opcion.precio;
            this.subtotal -= opcion.precio;
            opcion.cantidad -= 1;
            break;
          }
        }
        break;
      }
    }
    this.actualizarCanasta();
  }

  async vaciarCanasta(){
    const alert = await this.alertCtrl.create({
      cssClass: 'alert-canasta',
      header: 'Atención',
      mode: 'ios',
      message: '¿Estás seguro que deseas eliminar todos los productos de la canasta?',
      buttons: [
        {
          text: 'No, volver',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('cancel');
          }
        }, {
          text: 'Sí, seguro',
          handler: () => {
            this.canasta = [];
            this.subtotal = 0;
            this.totalProductos = 0;
            localStorage.setItem('totalizer', JSON.stringify({
              canasta: this.canasta,
              subtotal: this.subtotal,
              totalProductos: this. totalProductos
            }));
            this.cerrar();
            this.router.navigate(['home']);
          }
        }
      ]
    });

    await alert.present();
  }

  pedir(){
    console.log('Hace el pedido');
  }

  organizarCanasta(){
    for (const producto of this.canasta){
      producto.simple = producto.opciones.length === 1;
    }
  }

  actualizarCanasta(){
    localStorage.setItem('totalizer', JSON.stringify({
      canasta: this.canasta,
      subtotal: this.subtotal,
      totalProductos: this. totalProductos
    }));
  }

}



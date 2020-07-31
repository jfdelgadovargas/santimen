import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { SummaryPage } from '../summary/summary.page';
import { DetailmodalPage } from '../detailmodal/detailmodal.page';

@Component({
  selector: 'app-asados',
  templateUrl: './asados.page.html',
  styleUrls: ['../../../theme/utilities.scss', './asados.page.scss'],
})
export class AsadosPage implements OnInit {
  asados: Observable<any[]>;
  subtotal: 0;
  canasta = [];
  totalProductos = 0;
  opciones = [];

  constructor(private router: Router,
              private menuService: MenuService,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.asados = this.menuService.getMenu('asados');
    const totalizer =  JSON.parse(localStorage.getItem('totalizer'));
    this.canasta = totalizer.canasta;
    this.totalProductos = totalizer.totalProductos;
    this.subtotal = totalizer.subtotal;
  }

  async detail(item){
    this.menuService.getMenuDetail('asados', item.id).subscribe(opciones => {
      this.opciones = opciones;
      return opciones;
    });
    const modal = await this.modalCtrl.create({
      component: DetailmodalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion,
        precio: item.precio,
        imagen: item.imagen,
        opciones: this.menuService.getMenuDetail('asados', item.id)
      }
    });

    await modal.present();

    const data = await modal.onDidDismiss();
    const productos = this.canasta.length;
    if (data.data){
      data.data.opciones.subscribe(opciones => {
        data.data.opciones = opciones;
        const seleccion = data.data;
        const idSeleccionado = seleccion.opcionSeleccionada;
        if (productos === 0){
          /**/
          seleccion.arOpciones = [];
          const nuevaOpcion = Object.assign({}, seleccion.opciones.find(elemento => elemento.id === idSeleccionado));
          nuevaOpcion.cantidad = seleccion.cantidad;
          seleccion.arOpciones.push(nuevaOpcion);
          /**/
          this.canasta.push(seleccion);
          this.totalProductos += seleccion.cantidad;
        }else{
          let blFind = false;
          let blFindOption = false;
          for (const producto of this.canasta){
            if (seleccion.id === producto.id){
              blFind = true;
              /**/
              for (const opcion of producto.arOpciones){
                if (opcion.id === idSeleccionado){
                  blFindOption = true;
                  opcion.cantidad += seleccion.cantidad;
                  break;
                }
              }
              if (blFindOption === false){
                const nuevaOpcion = Object.assign({}, producto.opciones.find(elemento => elemento.id === idSeleccionado));
                nuevaOpcion.cantidad = seleccion.cantidad;
                producto.arOpciones.push(nuevaOpcion);
              }
              /**/
              producto.cantidad += seleccion.cantidad;
              producto.total += seleccion.total;
              this.totalProductos += seleccion.cantidad;
              break;
            }
          }
          if (blFind === false){
            /**/
          seleccion.arOpciones = [];
          for (const opcion of seleccion.opciones){
            if (opcion.id === idSeleccionado){
              const nuevaOpcion = Object.assign({}, opcion);
              nuevaOpcion.cantidad = seleccion.cantidad;
              seleccion.arOpciones.push(nuevaOpcion);
              break;
            }
          }
          /**/
          this.canasta.push(seleccion);
          this.totalProductos += seleccion.cantidad;
          }
        }
        this.subtotal += seleccion.total;
        localStorage.setItem('totalizer', JSON.stringify({
          canasta: this.canasta,
          subtotal: this.subtotal,
          totalProductos: this. totalProductos
        }));
      });
    }
  }

  async resumen(){
    console.log('Hace el pedido');
    const modalResumen = await this.modalCtrl.create({
      component: SummaryPage,
      cssClass: 'my-custom-class',
      componentProps: {
        canasta: this.canasta,
        totalProductos: this.totalProductos,
        subtotal: this.subtotal
      }
    });
    await modalResumen.present();
    const resumen = await modalResumen.onDidDismiss();
    const nuevosProductos = resumen.data;
    this.canasta = nuevosProductos.canasta;
    this.totalProductos = nuevosProductos.totalProductos;
    this.subtotal = nuevosProductos.subtotal;
    localStorage.setItem('totalizer', JSON.stringify({
      canasta: this.canasta,
      subtotal: this.subtotal,
      totalProductos: this. totalProductos
    }));
  }


  atras(){
    this.router.navigate(['/home']);
  }

}

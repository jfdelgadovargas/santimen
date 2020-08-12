import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MenuService } from 'src/app/services/menu.service';

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
  blDisabled = true;
  adicionales;

  constructor(private modalCtrl: ModalController,
              private menuService: MenuService) { }

  /**
   * Método de inicialización de la vista encargado
   * de cargar las opciones de un producto seleccionado.
   */
  ngOnInit() {
    this.menuService.getAdicionales(this.id).subscribe(respuesta => {
      this.adicionales = respuesta;
    });
    this.subtotal = this.precio;
    this.opciones.subscribe(opciones => {
      this.arrOpciones = opciones;
      this.blOpciones = opciones.length > 1;
      if (this.blOpciones === false){
        this.seleccion = opciones[0].id;
      }
      return opciones;
    });
  }

  /**
   * Método que cierra el panel de detalle de un producto y retorna los valores seleccionados.
   * @param blPide Parámetro que indica si se realizó un pedido o no.
   */
  cerrar(blPide){
    if (this.blDisabled && blPide){
      return;
    }
    if(blPide){
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

  /**
   * Método que resta 1 producto a la cantidad total y al total de dinero.
   */
  restar(){
    if (this.cantidad === 1){
      return;
    }
    this.cantidad -= 1;
    this.subtotal = this.precio * this.cantidad;
  }

  /**
   * Método que adiciona 1 producto a la cantidad total y al total de dinero.
   */
  adicionar(){
    this.cantidad += 1;
    this.subtotal = this.precio * this.cantidad;
  }

  /**
   * Método que escucha el cambio en la selección de las opciones d eun producto.
   * @param id Identificador de la opción del producto seleciconado.
   */
  seleccionar(id){
    if (!id.detail.value){
      this.blDisabled = true;
      return;
    }
    this.blDisabled = false;
    this.seleccion = id.detail.value;
    for (const item of this.arrOpciones){
      if (item.id === this.seleccion){
        this.precio = item.precio;
        this.subtotal = this.precio * this.cantidad;
      }
    }
  }

  seleccionarIncluido(seleccion, categoria){
    console.log('Incluido', seleccion.detail.value);
    console.log('Tipo', categoria.tipo);
  }

  seleccionarAdicional(seleccion, categoria){
    console.log('Tipo', categoria.tipo);
    console.log('Adicional', seleccion.display);
    console.log('Precio', seleccion.precio);
  }
}

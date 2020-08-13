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
  blOpcionPrincipal = false;
  adicionales = [];
  precioAdicionales = 0;

  incluidos = [];
  blHayIncluidos = false;
  blIncluidos = false;
  opcionales = [];
  opcionalesPago = [];

  constructor(private modalCtrl: ModalController,
              private menuService: MenuService) { }

  /**
   * Método de inicialización de la vista encargado
   * de cargar las opciones de un producto seleccionado.
   */
  ngOnInit() {
    this.menuService.getAdicionales(this.id).subscribe(respuesta => {
      for (const adicional of respuesta){
        if (adicional.tipo === 1){
          this.blHayIncluidos = true;
          break;
        }else{
          this.blHayIncluidos = false;
          this.validarAdicionales();
        }
      }
      for (const adicional of respuesta){
        adicional.blValida = false;
        for (const opcion of adicional.opciones){
          opcion.seleccionado = false;
        }
      }
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
    if (blPide){
      const incluidos = this.organizarAdicionales(1);
      const opcionales = this.organizarAdicionales(2);
      const opcionalesPago = this.organizarAdicionales(3);
      const obAdicionales = {
        incluidos,
        opcionales,
        opcionalesPago
      };
      this.modalCtrl.dismiss({
      cantidad: this.cantidad * 1,
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      imagen: this.imagen,
      precio: this.precio,
      opciones: this.opciones,
      opcionSeleccionada: this.seleccion,
      total: this.subtotal,
      obAdicionales
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
    this.subtotal = (this.precio + this.precioAdicionales) * this.cantidad;
  }

  /**
   * Método que adiciona 1 producto a la cantidad total y al total de dinero.
   */
  adicionar(){
    this.cantidad += 1;
    this.subtotal = (this.precio + this.precioAdicionales) * this.cantidad;
  }

  /**
   * Método que escucha el cambio en la selección de las opciones d eun producto.
   * @param id Identificador de la opción del producto seleciconado.
   */
  seleccionar(id){
    if (!id.detail.value){
      this.blOpcionPrincipal = false;
      this.validarAdicionales();
      return;
    }
    this.blOpcionPrincipal = true;
    this.validarAdicionales();
    this.seleccion = id.detail.value;
    for (const item of this.arrOpciones){
      if (item.id === this.seleccion){
        this.precio = item.precio;
        this.subtotal = (this.precio + this.precioAdicionales) * this.cantidad;
      }
    }
  }

  seleccionarIncluido(seleccion, categoria){
    if (!seleccion.detail.value){
      return;
    }
    const categoriaID = categoria.id;
    const incluidoID = seleccion.detail.value * 1;
    const tipo = this.adicionales.find(elemento => elemento.id === categoriaID);
    const opcion = tipo.opciones.find(elemento => elemento.id === incluidoID);
    for (const item of tipo.opciones){
      item.seleccionado = false;
    }
    opcion.seleccionado = true;
    tipo.blValida = true;
    this.validarAdicionales();
  }

  validarIncluidos(){
    for (const opcion of this.adicionales){
      if (opcion.tipo === 1){
        if (!opcion.blValida){
          this.blIncluidos = false;
          break;
        }
        else{
          this.blIncluidos = true;
        }
      }
    }
  }

  validarAdicionales(){
    if (!this.blHayIncluidos){
      this.blDisabled = !this.blOpcionPrincipal;
      return;
    }
    this.validarIncluidos();
    if (this.adicionales.length > 0){
      this.blDisabled = !(this.blOpcionPrincipal && this.blIncluidos);
    }else{
      this.blDisabled = !this.blOpcionPrincipal;
    }
  }

  seleccionarAdicional(seleccion, categoria){
    const categoriaID = categoria.id;
    const opcionID = seleccion.id;
    const tipo = this.adicionales.find(elemento => elemento.id === categoriaID);
    const opcion = tipo.opciones.find(elemento => elemento.id === opcionID);
    opcion.seleccionado = !opcion.seleccionado;
    if(opcion.seleccionado){
      this.precioAdicionales += opcion.precio;
      this.subtotal = (this.precio + this.precioAdicionales) * this.cantidad;
    }else{
      this.precioAdicionales -= opcion.precio;
      this.subtotal = (this.precio + this.precioAdicionales) * this.cantidad;
    }
    this.validarAdicionales();
  }

  organizarAdicionales(tipo){
    const adicionales = [];
    for (const item of this.adicionales){
      if (item.tipo === tipo){
        for (const adicional of item.opciones){
          if (adicional.seleccionado){
            adicional.categoriaID = item.id;
            adicional.categoriaDisplay = item.display;
            adicionales.push(adicional);
          }
        }
      }
    }
    return adicionales;
  }
}

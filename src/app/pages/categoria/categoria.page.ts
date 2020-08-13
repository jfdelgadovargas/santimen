import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuService } from 'src/app/services/menu.service';
import { ModalController, IonItem } from '@ionic/angular';
import { DetailmodalPage } from '../detailmodal/detailmodal.page';
import { SummaryPage } from '../summary/summary.page';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.page.html',
  styleUrls: ['../../../theme/utilities.scss', './categoria.page.scss'],
})
export class CategoriaPage implements OnInit {
  items: Observable<any[]>;
  categoriaID;
  nombreCategoria;
  subtotal: 0;
  canasta = [];
  totalProductos = 0;
  opciones = [];
  constructor(private router: Router,
              private menuService: MenuService,
              private modalCtrl: ModalController,
              private activatedRoute: ActivatedRoute) { }

  /**
   * Método de inicialización de la vista encargado
   * de la carga de productos de una categoría.
   */
  ngOnInit() {
    const categoriaID = this.activatedRoute.snapshot.paramMap.get('categoriaID');
    if (categoriaID){
      this.categoriaID = categoriaID;
      this.items = this.menuService.getMenu(this.categoriaID);
      this.nombreCategoria = this.menuService.getCategorias().subscribe(nombres => {
        const categoria = nombres.find(elemento => elemento.nombre === categoriaID);
        this.nombreCategoria = categoria.display;
      });
      const totalizer =  JSON.parse(localStorage.getItem('totalizer'));
      this.canasta = totalizer.canasta;
      this.totalProductos = totalizer.totalProductos;
      this.subtotal = totalizer.subtotal;
    }else{
      this.atras();
    }
  }

  /**
   * Método que abre un modal con la información de detalle de un producto.
   * @param item Objeto con la información del detalle de un producto.
   */
  async detail(item){
    this.menuService.getMenuDetail(this.categoriaID, item.id).subscribe(opciones => {
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
        opciones: this.menuService.getMenuDetail(this.categoriaID, item.id)
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
        // Si la canasta está vacía agrega el producto seleccionado.
        if (productos === 0){
          seleccion.arOpciones = [];
          const nuevaOpcion = Object.assign({}, seleccion.opciones.find(elemento => elemento.id === idSeleccionado));
          nuevaOpcion.cantidad = seleccion.cantidad;
          seleccion.arOpciones.push(nuevaOpcion);
          this.canasta.push(seleccion);
          this.totalProductos += seleccion.cantidad;
        }
        // Valida si el producto ya existe en la canasta para agregarle el valor y cantidad al total
        else{
          let blFind = false;
          let blFindOption = false;
          for (const producto of this.canasta){
            if (seleccion.id === producto.id){
              blFind = true;
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
              producto.cantidad += seleccion.cantidad;
              producto.total += seleccion.total;
              this.totalProductos += seleccion.cantidad;
              break;
            }
          }
          if (blFind === false){
          seleccion.arOpciones = [];
          for (const opcion of seleccion.opciones){
            if (opcion.id === idSeleccionado){
              const nuevaOpcion = Object.assign({}, opcion);
              nuevaOpcion.cantidad = seleccion.cantidad;
              seleccion.arOpciones.push(nuevaOpcion);
              break;
            }
          }
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

  /**
   * Muestra el detalle de los productos agregados a la canasta.
   */
  async resumen(){
    const modalResumen = await this.modalCtrl.create({
      component: SummaryPage,
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


  /**
   * Método encargado de direccionar al home.
   */
  atras(){
    this.router.navigate(['/home']);
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MenuService } from 'src/app/services/menu.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-opcionespagomodal',
  templateUrl: './opcionespagomodal.page.html',
  styleUrls: ['./opcionespagomodal.page.scss'],
})
export class OpcionespagomodalPage implements OnInit {
  @Input() opcionPago;
  opciones: Observable<any[]>;
  url;
  display;
  datos = [];
  constructor(private modalCtrl: ModalController,
              private menuService: MenuService) { }

  ngOnInit() {
    this.opciones = this.menuService.getOpcionesPago();
    const datos = this.opciones.subscribe(elemento => {
      this.datos = elemento;
    });
  }

  cerrar(){
    this.modalCtrl.dismiss({
      opcionPago: this.opcionPago,
      url: this.url,
      display: this.display
    });
  }

  seleccionarOpcion(opcion){
    const seleccion = opcion.detail.value;
    this.opcionPago = seleccion;
    const objetoSeleccionado = this.datos.find(elemento => elemento.valor === seleccion);
    if (!objetoSeleccionado){
      this.display = 'Efectivo';
      this.url = `../../../assets/images/efectivo.svg`;
      return;
    }
    this.display = objetoSeleccionado.display;
    this.url = `../../../assets/images/${seleccion}.svg`;
    this.cerrar();

  }

}

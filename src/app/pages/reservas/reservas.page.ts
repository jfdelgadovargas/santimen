import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {
  reservador = {
    nombre: '',
    identificacion: '',
    telefono: '',
    correo: '',
    fecha: '',
    hora: '',
    numeroPersonas: 1
    };

    blFormValid = false;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }


  cerrarReserva(){
    this.modalCtrl.dismiss();
  }

  validaFormulario(valorEntrada, campo){
    const valor = valorEntrada.detail.value;
    if (!valor){
      return;
      this.blFormValid = false;
    }
  }
}

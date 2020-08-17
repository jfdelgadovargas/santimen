import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {
  nombreForm;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }


  cerrarReserva(){
    this.modalCtrl.dismiss();
  }

  validaFormulario(){

  }
}

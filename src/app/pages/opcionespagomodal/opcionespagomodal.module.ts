import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpcionespagomodalPageRoutingModule } from './opcionespagomodal-routing.module';

import { OpcionespagomodalPage } from './opcionespagomodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpcionespagomodalPageRoutingModule
  ],
  declarations: [OpcionespagomodalPage]
})
export class OpcionespagomodalPageModule {}

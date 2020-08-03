import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpcionespagoPageRoutingModule } from './opcionespago-routing.module';

import { OpcionespagoPage } from './opcionespago.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpcionespagoPageRoutingModule
  ],
  declarations: [OpcionespagoPage]
})
export class OpcionespagoPageModule {}

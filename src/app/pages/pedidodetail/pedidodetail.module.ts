import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidodetailPageRoutingModule } from './pedidodetail-routing.module';

import { PedidodetailPage } from './pedidodetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidodetailPageRoutingModule
  ],
  declarations: [PedidodetailPage]
})
export class PedidodetailPageModule {}

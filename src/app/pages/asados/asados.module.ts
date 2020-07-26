import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsadosPageRoutingModule } from './asados-routing.module';

import { AsadosPage } from './asados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsadosPageRoutingModule
  ],
  declarations: [AsadosPage]
})
export class AsadosPageModule {}

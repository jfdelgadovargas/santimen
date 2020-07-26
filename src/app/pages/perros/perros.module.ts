import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerrosPageRoutingModule } from './perros-routing.module';

import { PerrosPage } from './perros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerrosPageRoutingModule
  ],
  declarations: [PerrosPage]
})
export class PerrosPageModule {}

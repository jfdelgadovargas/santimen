import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailmodalPageRoutingModule } from './detailmodal-routing.module';

import { DetailmodalPage } from './detailmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailmodalPageRoutingModule
  ],
  declarations: [DetailmodalPage]
})
export class DetailmodalPageModule {}

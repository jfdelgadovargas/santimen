import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { DetailmodalPage } from '../pages/detailmodal/detailmodal.page';
import { DetailmodalPageModule } from '../pages/detailmodal/detailmodal.module';
import { SummaryPageModule } from '../pages/summary/summary.module';
import { SummaryPage } from '../pages/summary/summary.page';


@NgModule({
  entryComponents:[
    DetailmodalPage,
    SummaryPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    DetailmodalPageModule,
    SummaryPageModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}

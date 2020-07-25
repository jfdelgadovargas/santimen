import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailmodalPage } from './detailmodal.page';

const routes: Routes = [
  {
    path: '',
    component: DetailmodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailmodalPageRoutingModule {}

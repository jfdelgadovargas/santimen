import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpcionespagomodalPage } from './opcionespagomodal.page';

const routes: Routes = [
  {
    path: '',
    component: OpcionespagomodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpcionespagomodalPageRoutingModule {}

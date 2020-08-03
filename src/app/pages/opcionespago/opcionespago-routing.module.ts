import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpcionespagoPage } from './opcionespago.page';

const routes: Routes = [
  {
    path: '',
    component: OpcionespagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpcionespagoPageRoutingModule {}

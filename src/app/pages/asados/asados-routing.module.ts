import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsadosPage } from './asados.page';

const routes: Routes = [
  {
    path: '',
    component: AsadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsadosPageRoutingModule {}

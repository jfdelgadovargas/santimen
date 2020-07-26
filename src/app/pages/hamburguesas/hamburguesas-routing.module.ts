import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HamburguesasPage } from './hamburguesas.page';

const routes: Routes = [
  {
    path: '',
    component: HamburguesasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HamburguesasPageRoutingModule {}

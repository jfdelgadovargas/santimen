import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerrosPage } from './perros.page';

const routes: Routes = [
  {
    path: '',
    component: PerrosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerrosPageRoutingModule {}

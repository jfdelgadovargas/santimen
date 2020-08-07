import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'categoria/:categoriaID',
    loadChildren: () => import('./pages/categoria/categoria.module').then( m => m.CategoriaPageModule)
  },
  {
    path: 'opcionespago',
    loadChildren: () => import('./pages/opcionespago/opcionespago.module').then( m => m.OpcionespagoPageModule)
  },
  {
    path: 'opcionespagomodal',
    loadChildren: () => import('./pages/opcionespagomodal/opcionespagomodal.module').then( m => m.OpcionespagomodalPageModule)
  },
  {
    path: 'pedidos',
    loadChildren: () => import('./pages/pedidos/pedidos.module').then( m => m.PedidosPageModule)
  },
  {
    path: 'pedidodetail',
    loadChildren: () => import('./pages/pedidodetail/pedidodetail.module').then( m => m.PedidodetailPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

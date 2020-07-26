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
  },  {
    path: 'hamburguesas',
    loadChildren: () => import('./pages/hamburguesas/hamburguesas.module').then( m => m.HamburguesasPageModule)
  },
  {
    path: 'perros',
    loadChildren: () => import('./pages/perros/perros.module').then( m => m.PerrosPageModule)
  },
  {
    path: 'asados',
    loadChildren: () => import('./pages/asados/asados.module').then( m => m.AsadosPageModule)
  },
  {
    path: 'pizzas',
    loadChildren: () => import('./pages/pizzas/pizzas.module').then( m => m.PizzasPageModule)
  },
  {
    path: 'otros',
    loadChildren: () => import('./pages/otros/otros.module').then( m => m.OtrosPageModule)
  },
  {
    path: 'bebidas',
    loadChildren: () => import('./pages/bebidas/bebidas.module').then( m => m.BebidasPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

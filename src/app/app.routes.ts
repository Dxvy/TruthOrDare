import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'mode',
    loadComponent: () => import('./pages/mode/mode.page').then( m => m.ModePage)
  },
  {
    path: 'partie',
    loadComponent: () => import('./pages/partie/partie.page').then( m => m.PartiePage)
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery.page').then( m => m.GalleryPage)
  },
];

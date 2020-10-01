import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about';
import { DashboardComponent } from './components/dashboard';
import { HeroDetailComponent } from './components/hero-detail';
import { HeroListComponent } from './components/hero-list';

/** Components */
import { HeroesIndexComponent } from './pages/heroes-index';

export const routes: Routes = [
  {
    path: '',
    component: HeroesIndexComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'heroes',
        component: HeroListComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      { path: 'heroes/:id', component: HeroDetailComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class HeroesRoutingModule {}

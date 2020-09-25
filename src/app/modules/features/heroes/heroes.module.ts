import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

/** Modules */
import { HeroesRoutingModule } from './heroes-routing.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

/** Services */
import { UserService } from './services/user.service';
import { HeroService } from './services/hero.service';
import { InMemoryDataService } from './services/in-memory-data.service';
import { HeroDetailService } from './services/hero-detail.service';

/** Pages */
import { HeroesIndexComponent } from './pages/heroes-index';

/** Components */
import { AboutComponent } from './components/about';
import { BannerComponent } from './components/banner';
import { DashboardComponent } from './components/dashboard';
import { DashboardHeroComponent } from './components/dashboard-hero';
import { DemoComponent } from './components/demo';
import { HeroDetailComponent } from './components/hero-detail';
import { HeroListComponent } from './components/hero-list';
import { TwainComponent } from './components/twain';
import { WelcomeComponent } from './components/welcome';
import { TwainService } from './services/twain.service';
import { FormsModule } from '@angular/forms';

/** Directives */
import { HighlightDirective } from './directives/highlight.directive';

@NgModule({
  imports: [
    CommonModule,
    HeroesRoutingModule,
    FormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
      dataEncapsulation: false,
    }),
  ],
  declarations: [
    AboutComponent,
    BannerComponent,
    DashboardComponent,
    DashboardHeroComponent,
    DemoComponent,
    HeroDetailComponent,
    HeroListComponent,
    HeroesIndexComponent,
    TwainComponent,
    WelcomeComponent,
    HighlightDirective,
  ],
  providers: [UserService, HeroService, TwainService, HeroDetailService],
})
export class HeroesModule {}

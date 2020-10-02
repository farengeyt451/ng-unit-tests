import { DebugElement } from '@angular/core';
import { Location } from '@angular/common';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation } from '@angular/common/testing';
import { Router, RouterLinkWithHref } from '@angular/router';
import { By } from '@angular/platform-browser';
import { asyncData, click, TestHeroService } from './testing';

import { routes } from './heroes-routing.module';
import { HeroesModule } from './heroes.module';
import { HeroesIndexComponent } from './pages/heroes-index';
import { AboutComponent } from './components/about';
import { DashboardComponent } from './components/dashboard';

import { HeroService } from './services/hero-service';
import { TwainService } from './services/twain.service';
import { HeroListComponent } from './components/hero-list';

let component: HeroesIndexComponent;
let fixture: ComponentFixture<HeroesIndexComponent>;
let page: Page;
let router: Router;
let locationSpy: SpyLocation;

/**
 * Testing HeroesIndexComponent and RouterTestingModule
 * Use fake HeroService (TestHeroService)
 * Use fake location (SpyLocation)
 * Use mock for #getQuote method
 */
describe('HeroesIndexComponent and RouterTestingModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HeroesModule, RouterTestingModule.withRoutes(routes)],
      providers: [{ provide: HeroService, useClass: TestHeroService }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HeroesIndexComponent);
        component = fixture.componentInstance;

        const injector = fixture.debugElement.injector;
        locationSpy = injector.get(Location) as SpyLocation;
        router = injector.get(Router);
        router.initialNavigation();

        /** Fake fast async observable */
        spyOn(injector.get(TwainService), 'getQuote').and.returnValue(
          asyncData('Test Quote')
        );

        page = new Page();
      });
  }));

  it('Should not navigate immediately', fakeAsync(() => {
    tick(); // Wait while navigating
    fixture.detectChanges(); // Update view
    tick(); // Wait for async data to arrive
    expect(locationSpy.path()).toBe('/');
    const el = fixture.debugElement.query(By.directive(DashboardComponent));
    expect(el).toBeNull();
  }));

  it('Should navigate to "About" on click', fakeAsync(() => {
    tick();
    fixture.detectChanges();
    tick();
    click(page.aboutLinkDe);
    tick();
    fixture.detectChanges();
    tick();
    expect(locationSpy.path()).toBe('/about');
    const el = fixture.debugElement.query(By.directive(AboutComponent));
    expect(el).toBeTruthy();
  }));

  it('Should navigate to "About" browser location URL change', fakeAsync(() => {
    tick();
    fixture.detectChanges();
    tick();
    locationSpy.simulateHashChange('/about');
    tick();
    fixture.detectChanges();
    tick();
    expect(locationSpy.path()).toBe('/about');
    const el = fixture.debugElement.query(By.directive(AboutComponent));
    expect(el).toBeTruthy();
  }));

  it('Should navigate to "Heroes" browser location URL change', fakeAsync(() => {
    tick();
    fixture.detectChanges();
    tick();
    locationSpy.simulateHashChange('/heroes');
    tick();
    fixture.detectChanges();
    tick();
    expect(locationSpy.path()).toBe('/heroes');
    const el = fixture.debugElement.query(By.directive(HeroListComponent));
    expect(el).toBeTruthy();
  }));
});

class Page {
  aboutLinkDe: DebugElement;
  dashboardLinkDe: DebugElement;
  heroesLinkDe: DebugElement;

  comp: HeroesIndexComponent;
  location: SpyLocation;
  router: Router;
  fixture: ComponentFixture<HeroesIndexComponent>;

  constructor() {
    const links = fixture.debugElement.queryAll(
      By.directive(RouterLinkWithHref)
    );
    this.aboutLinkDe = links[2];
    this.dashboardLinkDe = links[0];
    this.heroesLinkDe = links[1];
    this.comp = component;
    this.fixture = fixture;
    this.router = router;
  }
}

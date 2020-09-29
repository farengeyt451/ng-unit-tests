import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HeroService } from '../../services/hero.service';
import { DashboardHeroComponent } from '../dashboard-hero/dashboard-hero.component';
import { DashboardComponent } from './dashboard.component';

describe('Name of the group', () => {
  let component: DashboardComponent;
  let debugEl: DebugElement;
  let fixture: ComponentFixture<DashboardComponent>;
  let router: Router;

  const routerSpy: jasmine.SpyObj<Router> = jasmine.createSpyObj('Router', [
    'navigateByUrl',
  ]);
  const heroServiceSpy: jasmine.SpyObj<HeroService> = jasmine.createSpyObj(
    'HeroService',
    ['getHeroes']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HeroService, useValue: heroServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
    fixture = TestBed.createComponent(DashboardComponent);
    debugEl = fixture.debugElement;
    component = debugEl.componentInstance;
  });

  it('should tell ROUTER to navigate when hero clicked', () => {
    // args passed to router.navigateByUrl() spy
    const spy = router.navigateByUrl as jasmine.Spy;
    const navArgs = spy.calls.first().args[0];

    // expecting to navigate to id of the component's first hero
    const id = component.heroes[0].id;
    expect(navArgs).toBe(
      '/heroes/' + id,
      'should nav to HeroDetail for first hero'
    );
  });
});

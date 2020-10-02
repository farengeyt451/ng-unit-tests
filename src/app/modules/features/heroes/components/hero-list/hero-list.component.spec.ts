import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Hero } from '../../interfaces/hero.interface';
import { HeroService } from '../../services/hero-service';
import { asyncData, click, getTestHeroes } from '../../testing';
import { HeroListComponent } from './hero-list.component';

describe('Component: HeroListComponent', () => {
  let heroServiceSpy: jasmine.SpyObj<HeroService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let fixture: ComponentFixture<HeroListComponent>;
  let component: HeroListComponent;
  let debugEl: DebugElement;
  let testHeroes: Hero[];

  beforeEach(async () => {
    heroServiceSpy = jasmine.createSpyObj(HeroService, ['getHeroes']);
    routerSpy = jasmine.createSpyObj(Router, ['navigate']);

    TestBed.configureTestingModule({
      declarations: [HeroListComponent],
      providers: [
        { provide: HeroService, useValue: heroServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HeroListComponent);
        debugEl = fixture.debugElement;
        component = debugEl.componentInstance;
      });

    testHeroes = getTestHeroes();
    heroServiceSpy.getHeroes.and.returnValue(asyncData(testHeroes));
  });

  it('Should create component', () => {
    expect(component).toBeTruthy();
  });

  it('Should inject stub service and stub router', inject(
    [HeroService, Router],
    (service: HeroService, router: Router) => {
      expect(service).toEqual(heroServiceSpy);
      expect(router).toEqual(routerSpy);
    }
  ));

  it('Should get heroes from service', fakeAsync(() => {
    fixture.detectChanges();

    component.heroes.subscribe((heroes: Hero[]) => {
      expect(heroes.length).toBe(6);
      expect(heroes[0].id).toBe(testHeroes[0].id);
    });

    flush();
  }));

  it('Should render hero list', fakeAsync(() => {
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const listEls: DebugElement[] = debugEl.queryAll(
        By.css('.hero-list__hero')
      );
      expect(listEls.length).toBe(testHeroes.length);

      const badge: DebugElement = debugEl.query(By.css('.hero-list__badge'));
      expect(badge.nativeElement.textContent).toBe(String(testHeroes[0].id));
    });
  }));

  it('Should set #selectedHero on hero item click', fakeAsync(() => {
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const lastHero = debugEl.query(By.css('.hero-list__hero:last-child'));

      click(lastHero);

      fixture.detectChanges();

      expect(component.selectedHero).toEqual(testHeroes[testHeroes.length - 1]);
    });
  }));

  it('Should navigate on hero item click', fakeAsync(() => {
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const lastHero = debugEl.query(By.css('.hero-list__hero'));

      click(lastHero);

      fixture.detectChanges();

      expect(routerSpy.navigate.calls.any()).toBeTruthy();
      expect(routerSpy.navigate.calls.first().args.length).toBe(1);
      expect(routerSpy.navigate.calls.first().args[0]).toContain('../heroes');
      expect(routerSpy.navigate.calls.first().args[0]).toContain(
        testHeroes[0].id
      );
    });
  }));
});

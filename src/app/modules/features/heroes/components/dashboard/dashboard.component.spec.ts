import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HeroService } from '../../services/hero-service';
import { asyncData, click, getTestHeroes } from '../../testing';
import { DashboardHeroComponent } from '../dashboard-hero/dashboard-hero.component';
import { DashboardComponent } from './dashboard.component';

/**
 * Deep DashboardComponent testing
 * Create real instances for DashboardHeroComponent
 */
describe('Component: DashboardComponent', () => {
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HeroService, useValue: heroServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
      declarations: [DashboardComponent, DashboardHeroComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DashboardComponent);
        debugEl = fixture.debugElement;
        component = debugEl.componentInstance;
        router = fixture.debugElement.injector.get(Router);
        heroServiceSpy.getHeroes.and.returnValue(asyncData(getTestHeroes()));
      });
  }));

  it('Should not have heroes before ngOnInit', () => {
    expect(component.heroes.length).toBe(0); // 0 heroes on init
  });

  it('Should not have heroes immediately after ngOnInit', () => {
    fixture.detectChanges();
    expect(component.heroes.length).toBe(0);
  });

  it('Should have heroes', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.heroes.length).toBeGreaterThan(0);
    });
  }));

  /**
   * First fixture.detectChanges() - start process of receive async data
   * whenStable() - wait for observable emit (JavaScript engine's task queue becomes empty)
   * Second fixture.detectChanges() - bind received data to view, update view
   */
  it('Should display heroes', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const heroesDOM = debugEl.queryAll(By.css('.dashboard-hero'));
      expect(heroesDOM.length).toBe(4);
    });
  }));

  it('Should tell router to navigate when hero clicked', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const firstHeroDOM = debugEl.query(By.css('.dashboard-hero'));
      click(firstHeroDOM);

      const spy = router.navigateByUrl as jasmine.Spy;

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy.calls.first().args[0]).toBe(
        `/heroes/${component.heroes[0].id}`
      );
    });
  }));
});

/**
 * Shallow DashboardComponent testing
 * Use NO_ERRORS_SCHEMA
 */
describe('Component: DashboardComponent', () => {
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HeroService, useValue: heroServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
      declarations: [DashboardComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DashboardComponent);
        debugEl = fixture.debugElement;
        component = debugEl.componentInstance;
        router = fixture.debugElement.injector.get(Router);
        heroServiceSpy.getHeroes.and.returnValue(asyncData(getTestHeroes()));
      });
  }));

  it('Should not have heroes before ngOnInit', () => {
    expect(component.heroes.length).toBe(0); // 0 heroes on init
  });

  it('Should not have heroes immediately after ngOnInit', () => {
    fixture.detectChanges();
    expect(component.heroes.length).toBe(0);
  });

  it('Should have heroes', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.heroes.length).toBeGreaterThan(0);
    });
  }));

  it('Should tell router to navigate when hero clicked', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.gotoDetail(getTestHeroes()[1]);

      const spy = router.navigateByUrl as jasmine.Spy;

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy.calls.first().args[0]).toBe(
        `/heroes/${component.heroes[0].id}`
      );
    });
  }));
});

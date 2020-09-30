import { HeroDetailComponent } from './hero-detail.component';
import { HeroDetailService } from '../../services/hero-detail.service';
import { Hero } from '../../interfaces/hero.interface';
import {
  asyncData,
  ActivatedRouteStub,
  ActivatedRoute,
  getTestHeroes,
  TestHeroService,
  click,
} from '../../testing';
import { Router } from '@angular/router';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HeroService } from '../../services/hero.service';

describe('HeroDetailComponent - without TestBed', () => {
  let component: HeroDetailComponent;
  let expectedHero: Hero;
  let heroDetailServiceSpy: jasmine.SpyObj<HeroDetailService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach((done: DoneFn) => {
    expectedHero = { id: 42, name: 'Bubba' };
    const activatedRouteStub = new ActivatedRouteStub({ id: expectedHero.id });
    router = jasmine.createSpyObj('router', ['navigate']);

    heroDetailServiceSpy = jasmine.createSpyObj('HeroDetailService', [
      'getHero',
      'saveHero',
    ]);

    heroDetailServiceSpy.getHero.and.returnValue(asyncData(expectedHero));
    heroDetailServiceSpy.saveHero.and.returnValue(asyncData(expectedHero));

    component = new HeroDetailComponent(
      heroDetailServiceSpy,
      activatedRouteStub as any,
      router
    );

    component.ngOnInit();

    /** OnInit - subToRouting, then call getHero(); wait for it to get the fake heros */
    heroDetailServiceSpy.getHero.calls.first().returnValue.subscribe(done);
  });

  it('Should expose the hero retrieved from the service', () => {
    expect(component.hero).toBe(expectedHero);
  });

  it('Should navigate when click cancel', () => {
    component.onCancel();
    expect(router.navigate.calls.any()).toBe(true);
  });

  it('Should save when click save', () => {
    component.onSave();

    expect(heroDetailServiceSpy.saveHero.calls.any()).toBe(true);
    expect(heroDetailServiceSpy.saveHero).toHaveBeenCalled();
    expect(heroDetailServiceSpy.saveHero).toHaveBeenCalledTimes(1);

    expect(router.navigate.calls.any()).toBe(false);
    expect(router.navigate).toHaveBeenCalledTimes(0);
  });

  it('Should navigate when click save resolves', (done: DoneFn) => {
    component.onSave();

    /**
     * Get the first invocation of this spy
     * Waits for async save to complete
     * Check whether router.navigate spy has been invoked
     **/
    heroDetailServiceSpy.saveHero.calls.first().returnValue.subscribe(() => {
      expect(router.navigate.calls.any()).toBe(true);
      done();
    });
  });
});

describe('HeroDetailComponent - with TestBed', () => {
  let fixture: ComponentFixture<HeroDetailComponent>;
  let debugEl: DebugElement;
  let component: HeroDetailComponent;
  let heroDetailServiceSpy: jasmine.SpyObj<HeroDetailService>;
  let expectedHero: Hero = getTestHeroes()[0];

  const activatedRouteStub = new ActivatedRouteStub({ id: expectedHero.id });
  const routerSpy: jasmine.SpyObj<Router> = jasmine.createSpyObj(Router, [
    'navigate',
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        { provide: HeroDetailService, useValue: {} },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerSpy },
      ],
    })
      .overrideComponent(HeroDetailComponent, {
        set: {
          providers: [
            {
              provide: HeroDetailService,
              useClass: HeroDetailServiceSpy,
            },
          ],
        },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HeroDetailComponent);
        debugEl = fixture.debugElement;
        component = debugEl.componentInstance;
        heroDetailServiceSpy = fixture.debugElement.injector.get(
          HeroDetailService
        ) as any;
      });

    // heroDetailServiceSpy.getHero.and.returnValue(asyncData(expectedHero));
  }));

  it('Should create component', async(() => {
    expect(component).toBeTruthy();
  }));

  it('Should have called `getHero`', () => {
    fixture.detectChanges();
    expect(heroDetailServiceSpy.getHero.calls.count()).toBe(1);
  });

  it('Should display hero name component', async(() => {
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(debugEl.query(By.css('.hero-detail__name'))).toBeTruthy();
      expect(
        debugEl.query(By.css('.hero-detail__name')).nativeElement.textContent
      ).toBe('Test Hero');
      expect(component).toBeTruthy();
    });
  }));

  it('Should navigate to relative path "../" if hero does not exist', async(() => {
    heroDetailServiceSpy.getHero.and.returnValue(asyncData(null));

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(routerSpy.navigate).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate.calls.any()).toBe(true);
      expect(routerSpy.navigate.calls.first().args.length).toBe(2);
      expect(routerSpy.navigate.calls.first().args[0]).toContain('../');
    });
  }));
});

/**
 * Work with real HeroDetailService and stub HeroService (TestHeroService)
 * Real HeroDetailService call fake getHero() method in fake HeroService (TestHeroService)
 * Real HeroDetailService call fake updateHero() method in fake HeroService, which delivers a safe test result
 * Stub ActivatedRoute
 */
fdescribe('HeroDetailComponent - Case 1', () => {
  let activatedRoute: ActivatedRouteStub;

  beforeEach(() => {
    activatedRoute = new ActivatedRouteStub();
  });
  describe('With HeroModule setup', () => {
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async(() => {
      routerSpy = jasmine.createSpyObj('Router', ['navigate']);

      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [HeroDetailComponent],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRoute },
          { provide: HeroService, useClass: TestHeroService },
          { provide: Router, useValue: routerSpy },
        ],
      }).compileComponents();
    }));

    describe('When navigate to existing hero', () => {
      let expectedHero: Hero;
      let fixture: ComponentFixture<HeroDetailComponent>;
      let component: HeroDetailComponent;
      let debugEl: DebugElement;

      beforeEach(async(() => {
        expectedHero = getTestHeroes()[1];
        activatedRoute.setParamMap({ id: expectedHero.id });

        fixture = TestBed.createComponent(HeroDetailComponent);
        debugEl = fixture.debugElement;
        component = debugEl.componentInstance;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
        });
      }));

      it('Should display hero name', () => {
        const heroName = debugEl.query(By.css('.hero-detail__name'));

        expect(heroName.nativeElement.textContent).toBe(
          getTestHeroes()[1].name
        );
      });

      it('Should navigate when click cancel', () => {
        const heroName = debugEl.query(By.css('.hero-detail__action--cancel'));
        click(heroName);

        expect(routerSpy.navigate.calls.any()).toBe(true);
        expect(routerSpy.navigate).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
      });

      it('Should save when click save, but not navigate immediately', () => {
        /**
         * Get service injected into component and spy on its saveHero() method
         * It delegates to fake `HeroService.updateHero` which delivers a safe test result
         **/
        const hds = fixture.debugElement.injector.get(HeroDetailService);

        const saveSpy = spyOn(hds, 'saveHero').and.callThrough();
        const saveBtn = debugEl.query(By.css('.hero-detail__action--save'));

        click(saveBtn);

        expect(saveSpy.calls.any()).toBe(true);
        expect(saveSpy).toHaveBeenCalled();
        expect(saveSpy).toHaveBeenCalledTimes(1);

        expect(routerSpy.navigate.calls.any()).toBe(false);
        expect(routerSpy.navigate).toHaveBeenCalledTimes(0);
      });

      /** Wait for heroDetailService.saveHero(this.hero).subscribe() emits success */
      it('Should navigate when click save and save resolves', fakeAsync(() => {
        const saveBtn = debugEl.query(By.css('.hero-detail__action--save'));
        click(saveBtn);
        tick();
        expect(routerSpy.navigate.calls.any()).toBe(true);
        expect(routerSpy.navigate).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
      }));

      it('Should convert hero name to Title Case', () => {
        const nameInput: DebugElement = debugEl.query(
          By.css('.hero-detail__input')
        );
        const nameDisplay: DebugElement = debugEl.query(
          By.css('.hero-detail__name')
        );

        nameInput.nativeElement.value = 'quick BROWN fOx';

        /** Dispatch a DOM event so that Angular learns of input value change */
        nameInput.nativeElement.dispatchEvent(new Event('input'));

        /** Tell Angular to update the display binding through the title pipe */
        fixture.detectChanges();

        expect(nameDisplay.nativeElement.textContent).toBe('Quick Brown Fox');
      });
    });
  });
});

class HeroDetailServiceSpy {
  testHero: Hero = { id: 42, name: 'Test Hero' };

  getHero = jasmine
    .createSpy('getHero')
    .and.callFake(() => asyncData(Object.assign({}, this.testHero)));

  saveHero = jasmine
    .createSpy('saveHero')
    .and.callFake((hero: Hero) =>
      asyncData(Object.assign(this.testHero, hero))
    );
}

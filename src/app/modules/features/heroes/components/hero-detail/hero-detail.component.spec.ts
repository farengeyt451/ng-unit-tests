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
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
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
describe('Component: HeroDetailComponent - with "HeroModule" setup', () => {
  let expectedHero: Hero;
  let fixture: ComponentFixture<HeroDetailComponent>;
  let component: HeroDetailComponent;
  let debugEl: DebugElement;
  let activatedRoute: ActivatedRouteStub;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    activatedRoute = new ActivatedRouteStub();
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
  });

  describe('When navigate to existing hero', () => {
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

      expect(heroName.nativeElement.textContent).toBe(getTestHeroes()[1].name);
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

    it('Should navigate to relative path "../" if hero does not exist', async(() => {
      activatedRoute.setParamMap({ id: 99999 });

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
});

/**
 * Override HeroDetailComponent (by HeroDetailServiceSpy) provided in HeroDetailComponent
 * HeroDetailServiceSpy does not call HeroService methods, instead call fake #getHero and #saveHero methods
 * Use stub activatedRoute, but ActivatedRouteStub irrelevant here (ignored, because we use strait HeroDetailServiceSpy)
 */
describe('Component: HeroDetailComponent - override its provided HeroDetailService', () => {
  let fixture: ComponentFixture<HeroDetailComponent>;
  let component: HeroDetailComponent;
  let debugEl: DebugElement;
  let activatedRoute: ActivatedRouteStub;
  let routerSpy: jasmine.SpyObj<Router>;
  let hdsSpy: HeroDetailServiceSpy;

  beforeEach(async(() => {
    routerSpy = jasmine.createSpyObj(Router, ['navigate']);
    activatedRoute = new ActivatedRouteStub({ id: 99999 }); // Ignored by fixture component

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: routerSpy },
        { provide: HeroDetailService, useValue: {} }, // HeroDetailService provided in HeroDetailComponent
      ],
    })

      /**
       * Override component's own provider
       * It's not possible to stub the component's HeroDetailService in the providers of the TestBed.configureTestingModule
       * Those are providers for the testing module, not the component
       * They prepare the dependency injector at the fixture level
       * TestBed.overrideComponent method can replace the component's providers with easy-to-manage test doubles
       */
      .overrideComponent(HeroDetailComponent, {
        set: {
          providers: [
            { provide: HeroDetailService, useClass: HeroDetailServiceSpy },
          ],
        },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HeroDetailComponent);
        debugEl = fixture.debugElement;
        component = debugEl.componentInstance;

        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();
        });

        hdsSpy = fixture.debugElement.injector.get(HeroDetailService) as any;
      });
  }));

  it('Should have called #getHero', () => {
    expect(hdsSpy.getHero.calls.count()).toBe(1);
    expect(hdsSpy.getHero).toHaveBeenCalled();
    expect(hdsSpy.getHero).toHaveBeenCalledTimes(1);
  });

  it("Should display stub hero's name", () => {
    const heroName = debugEl.query(By.css('.hero-detail__name'));
    expect(heroName.nativeElement.textContent).toBe(hdsSpy.testHero.name);
  });

  it('Should save stub hero change', fakeAsync(() => {
    const origName = hdsSpy.testHero.name;
    const newName = 'New Name';
    const nameInput: DebugElement = debugEl.query(
      By.css('.hero-detail__input')
    );

    nameInput.nativeElement.value = newName;

    nameInput.nativeElement.dispatchEvent(new Event('input')); // Simulate user input

    expect(component.hero.name).toBe(newName); // Two-way binding through ngModel, name should change
    expect(hdsSpy.testHero.name).toBe(origName); // In service should be old name before saving

    const saveBtn = debugEl.query(By.css('.hero-detail__action--save'));

    click(saveBtn); // Simulate user click "Save" button

    expect(hdsSpy.saveHero.calls.count()).toBe(1);

    tick(); // Wait for async save to complete
    expect(hdsSpy.testHero.name).toBe(newName);
    expect(routerSpy.navigate.calls.any()).toBe(true);
  }));

  /**
   * 1. #inject gets the service from the fixture
   * 2. fixture.debugElement.injector to get service from component
   * 3. compare services, they should not be equal
   **/
  it('Fixture injected service is not the component injected service', inject(
    [HeroDetailService],
    (fixtureService: HeroDetailService) => {
      const componentService = fixture.debugElement.injector.get(
        HeroDetailService
      );
      expect(fixtureService).not.toBe(componentService);
    }
  ));
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

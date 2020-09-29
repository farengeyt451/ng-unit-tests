import { fakeAsync, inject, tick } from '@angular/core/testing';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroDetailService } from '../../services/hero-detail.service';
import { Hero } from '../../interfaces/hero.interface';
import { asyncData, ActivatedRouteStub } from '../../testing';
import { Injector } from '@angular/core';

describe('HeroDetailComponent - without TestBed', () => {
  let component: HeroDetailComponent;
  let expectedHero: Hero;
  let heroDetailServiceSpy: jasmine.SpyObj<HeroDetailService>;
  let router: any;

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
    expect(router.navigate.calls.any()).toBe(true, 'router.navigate called');
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

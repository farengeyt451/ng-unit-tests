import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RouterLinkDirectiveStub } from '../../testing';

import { HeroesIndexComponent } from './heroes-index.component';

@Component({ selector: 'banner', template: '' })
class BannerStubComponent {}

@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent {}

@Component({ selector: 'welcome', template: '' })
class WelcomeStubComponent {}

let component: HeroesIndexComponent;
let fixture: ComponentFixture<HeroesIndexComponent>;
let debugEl: DebugElement;

/**
 * Stubbing unneeded components
 * Create and declare stub versions of the components and directive that play little or no role in the tests
 */
describe('HeroesIndexComponent and stubbing unneeded components', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeroesIndexComponent,
        RouterLinkDirectiveStub,
        BannerStubComponent,
        RouterOutletStubComponent,
        WelcomeStubComponent,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HeroesIndexComponent);
        debugEl = fixture.debugElement;
        component = debugEl.componentInstance;
      });
  }));
  tests();
});

/**
 * NO_ERRORS_SCHEMA
 * The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized elements and attributes
 */
describe('HeroesIndexComponent and use NO_ERRORS_SCHEMA', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeroesIndexComponent, RouterLinkDirectiveStub],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HeroesIndexComponent);
        component = fixture.componentInstance;
      });
  }));
  tests();
});

/**
 * Testing w/ real root module
 * Tricky because we are disabling the router and its configuration
 * Better to use RouterTestingModule
 */
import { HeroesModule } from '../../heroes.module';
import { HeroesRoutingModule } from '../../heroes-routing.module';

describe('HeroesIndexComponent & HeroesModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({ imports: [HeroesModule] })

      /** Get rid of app's Router configuration otherwise many failures */
      /** Doing so removes Router declarations; add the Router stubs */
      .overrideModule(HeroesModule, {
        remove: { imports: [HeroesRoutingModule] },
        add: {
          declarations: [RouterLinkDirectiveStub, RouterOutletStubComponent],
        },
      })

      .compileComponents()

      .then(() => {
        fixture = TestBed.createComponent(HeroesIndexComponent);
        component = fixture.componentInstance;
      });
  }));

  tests();
});

function tests() {
  let routerLinks: RouterLinkDirectiveStub[];
  let linksWithRouterLinkDebug: DebugElement[];

  beforeEach(() => {
    fixture.detectChanges(); // Trigger initial data binding

    /** Find DebugElements with an attached RouterLinkStubDirective */
    linksWithRouterLinkDebug = fixture.debugElement.queryAll(
      By.directive(RouterLinkDirectiveStub)
    );

    /**
     * Get attached link directive instances
     * Using each DebugElement's injector
     */
    routerLinks = linksWithRouterLinkDebug.map((link) =>
      link.injector.get(RouterLinkDirectiveStub)
    );
  });

  it('Should create component', () => {
    expect(component).not.toBeNull();
  });

  it('Should get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(3);
    expect(routerLinks[0].linkParams).toBe('/dashboard');
    expect(routerLinks[1].linkParams).toBe('/heroes');
    expect(routerLinks[2].linkParams).toBe('/about');
  });

  it('can click Heroes link in template', () => {
    const heroesLinkDe = linksWithRouterLinkDebug[1]; // Heroes link DebugElement
    const heroesLink = routerLinks[1]; // Heroes link directive

    /**
     * Fist navigatedTo should be null
     * After click the link with attached RouterLinkDirectiveStub - check for navigation start
     */
    expect(heroesLink.navigatedTo).toBeNull();

    heroesLinkDe.triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(heroesLink.navigatedTo).toBe('/heroes');
  });
}

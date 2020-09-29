import { DashboardHeroComponent } from './dashboard-hero.component';
import { Hero } from '../../interfaces/hero.interface';
import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { click } from '../../testing';

/**
 * DashboardHeroComponent testing
 * It contains @Input and @Output decorators
 *
 * Testing without creating the DashboardHeroComponent or its parent component
 */
describe('Component: DashboardHeroComponent', () => {
  it('Dispatch the selected event when clicked', () => {
    const component = new DashboardHeroComponent();
    const hero: Hero = { id: 42, name: 'Test' };
    component.hero = hero;

    component.selected.subscribe((selectedHero: Hero) =>
      expect(selectedHero).toBe(hero)
    );
    component.click();
  });
});

describe('Component: DashboardHeroComponent - standalone', () => {
  let fixture: ComponentFixture<DashboardHeroComponent>;
  let component: DashboardHeroComponent;
  let debugEl: DebugElement;
  let heroDebugEl: DebugElement;
  const expectedHero = { id: 42, name: 'Test Name' };

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [DashboardHeroComponent] });

    fixture = TestBed.createComponent(DashboardHeroComponent);
    debugEl = fixture.debugElement;
    component = debugEl.componentInstance;

    heroDebugEl = debugEl.query(By.css('.dashboard-hero'));
  });

  it('Should display hero name in uppercase', () => {
    /** Simulate @Input() */
    component.hero = expectedHero;
    fixture.detectChanges();
    const expectedPipedName = expectedHero.name.toUpperCase();
    expect(heroDebugEl.nativeElement.textContent).toContain(expectedPipedName);
  });

  it('Should raise selected event when clicked (triggerEventHandler)', () => {
    let selectedHero: Hero;
    component.hero = expectedHero;
    component.selected.subscribe((hero: Hero) => {
      selectedHero = hero;
    });
    /**
     * Simulate click on hero element
     * triggerEventHandler() will work only if element has event binding
     */
    heroDebugEl.triggerEventHandler('click', null);
    expect(selectedHero).toEqual(expectedHero);
  });

  it('Should raise selected event when clicked (click helper)', () => {
    let selectedHero: Hero;
    component.hero = expectedHero;
    component.selected.subscribe((hero: Hero) => (selectedHero = hero));

    /**
     * Simulate click on native element
     */
    click(heroDebugEl.nativeElement); // Click helper with native element

    expect(selectedHero).toEqual(expectedHero);
  });
});

describe('Component: DashboardHeroComponent - when inside a test host', () => {
  let testHost: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let heroEl: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardHeroComponent, TestHostComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    /** Create TestHostComponent instead of DashboardHeroComponent */
    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    heroEl = fixture.nativeElement.querySelector('.dashboard-hero');
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('Should display hero name', () => {
    const expectedPipedName = testHost.hero.name.toUpperCase();
    expect(heroEl.textContent).toContain(expectedPipedName);
  });

  it('Should raise selected event when clicked', () => {
    click(heroEl);
    /** Selected hero should be the same data bound hero */
    expect(testHost.selectedHero).toBe(testHost.hero);
  });
});

/** Test host - wrapper component */
@Component({
  template: ` <dashboard-hero [hero]="hero" (selected)="onSelectedHero($event)">
  </dashboard-hero>`,
})
class TestHostComponent {
  hero: Hero = { id: 42, name: 'Test Name' };
  selectedHero: Hero;
  onSelectedHero(hero: Hero) {
    this.selectedHero = hero;
  }
}

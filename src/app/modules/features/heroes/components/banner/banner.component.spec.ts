import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BannerComponent } from './banner.component';

/**
 * BannerComponent testing
 */
describe('Component: BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [BannerComponent] });
    /** Fixture - wrapper for for debugging and testing a component */
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
  });

  it('Should create component', () => {
    expect(component).toBeDefined();
  });

  it('Should have <p> with "Test Tour of Heroes"', () => {
    /** If platform browser - fixture.nativeElement can be used */
    const bannerElement: HTMLElement = fixture.nativeElement;
    const h1 = bannerElement.querySelector('h1');
    expect(h1.textContent).toBe('');
    /**
     * Binding happens when Angular performs change detection
     * detectChanges() run all lifecycle hooks
     */
    fixture.detectChanges();
    expect(h1.textContent).toEqual('Test Tour of Heroes');
  });

  it('Should find the <p> with fixture.debugElement.nativeElement)', () => {
    /**  DebugElement abstraction for safe across all supported platforms. */
    const bannerDe: DebugElement = fixture.debugElement;
    const bannerEl: HTMLElement = bannerDe.nativeElement;
    const h1 = bannerEl.querySelector('h1');
    fixture.detectChanges();
    expect(h1.textContent).toEqual('Test Tour of Heroes');
  });

  it('Should find the <p> with fixture.debugElement.query(By.css)', () => {
    /**
     * The server-side renderer might not support the full HTML element API
     * Predicate with the help of a By class to save query in all platform
     **/
    const bannerDe: DebugElement = fixture.debugElement;
    const paragraphDe = bannerDe.query(By.css('h1'));
    const h1: HTMLElement = paragraphDe.nativeElement;
    fixture.detectChanges();
    expect(h1.textContent).toEqual('Test Tour of Heroes');
  });
});

/**
 * Automatic change detection
 */
describe('Component: BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let bannerDe: DebugElement;
  let paragraphDe: DebugElement;
  let h1: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BannerComponent],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    });

    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    bannerDe = fixture.debugElement;
    paragraphDe = bannerDe.query(By.css('h1'));
    h1 = paragraphDe.nativeElement;
  });

  it('Should display original title', () => {
    /** No `fixture.detectChanges()` needed */
    expect(h1.textContent).toContain(component.title);
  });

  it('Should still see original title after component.title change', () => {
    const oldTitle = component.title;
    component.title = 'Test Title';
    /** Displayed title is old because Angular didn't hear the change */
    expect(h1.textContent).toContain(oldTitle);
  });

  it('Should display updated title after detectChanges', () => {
    component.title = 'Test Title';
    /** Detect changes explicitly */
    fixture.detectChanges();
    expect(h1.textContent).toContain(component.title);
  });
});

import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { cold, getTestScheduler } from 'jasmine-marbles';

import { TwainComponent } from './twain.component';
import { TwainService } from '../../services/twain.service';
import { asyncData } from '../../testing';
describe('Component: TwainComponent', () => {
  let fixture: ComponentFixture<TwainComponent>;
  let component: TwainComponent;
  let debugEl: DebugElement;
  let quoteNativeEl: HTMLElement;
  let twainServiceSpy: jasmine.SpyObj<TwainService>;
  const testQuote = 'Test quote';

  beforeEach(() => {
    /** Use spy instead real service */
    twainServiceSpy = jasmine.createSpyObj('TwainService', ['getQuote']);

    TestBed.configureTestingModule({
      declarations: [TwainComponent],
      providers: [
        {
          provide: TwainService,
          useValue: twainServiceSpy,
        },
      ],
    });
    /**
     * Spy return synchronous Observable
     * Any call to getQuote receives an observable with a test quote
     **/
    twainServiceSpy.getQuote.and.returnValue(of(testQuote));

    fixture = TestBed.createComponent(TwainComponent);
    debugEl = fixture.debugElement;
    component = debugEl.componentInstance;
    quoteNativeEl = debugEl.query(By.css('.twain__quote')).nativeElement;
  });

  it('Should create component', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test with sync observable
   * getQuote() method updates the message on screen immediately after the first change detection cycle during which Angular calls ngOnInit
   * */
  it('Should show quote after component initialized', () => {
    fixture.detectChanges();
    expect(quoteNativeEl).toBeTruthy();
    expect(quoteNativeEl.textContent).toBe(testQuote);
  });

  /**
   * fakeAsync() run test body in special test zone
   * The body appears to be synchronous
   * The fakeAsync() function won't work if the test body makes an XMLHttpRequest (XHR) call
   */
  it('Should display error when TwainService fails', fakeAsync(() => {
    const errMsg: string = 'TwainService test failure';
    /*
     twainServiceSpy.getQuote.and
     .returnValue(of(testQuote))
     .and.returnValue(throwError('TwainService test failure'));
     */

    twainServiceSpy.getQuote.and.returnValue(throwError(errMsg));

    fixture.detectChanges(); // Run fist detect changes cycle

    /**  tick() simulates the passage of time until all pending asynchronous activities finish */
    tick(); // Flush setTimeout

    fixture.detectChanges(); // Run second detect changes cycle, update errorMessage within setTimeout()

    expect(quoteNativeEl.textContent).toContain('...');
    expect(
      debugEl.query(By.css('.twain__error')).nativeElement.textContent.trim()
    ).toBe(errMsg);
  }));

  it('Should show quote after async #getQuote', fakeAsync(() => {
    /** Simulate async observable */
    twainServiceSpy.getQuote.and.returnValue(asyncData('Async quote'));

    fixture.detectChanges(); // ngOnInit()
    expect(quoteNativeEl.textContent).toBe('...');

    tick(); // Flush the observable to get the quote

    fixture.detectChanges(); // Update view

    expect(quoteNativeEl.textContent).toBe('Async quote');
    expect(debugEl.query(By.css('.twain__error'))).toBeNull();
  }));

  /**
   * The TestBed.compileComponents() method (see below) calls XHR to read external template and css files during "just-in-time" compilation
   * Use async() to run test body in special async test zone
   */
  it('Should show quote after getQuote (async)', async(() => {
    /** Simulate async observable */
    twainServiceSpy.getQuote.and.returnValue(asyncData('Async quote'));

    fixture.detectChanges(); // ngOnInit()

    expect(quoteNativeEl.textContent).toBe('...');

    /**
     * The test must wait for the getQuote() observable to emit the next quote. Instead of calling tick(), it calls fixture.whenStable()
     * The fixture.whenStable() returns a promise that resolves when the JavaScript engine's task queue becomes empty
     */
    fixture.whenStable().then(() => {
      /** Wait for async getQuote */
      fixture.detectChanges(); // Update view with quote
      expect(quoteNativeEl.textContent).toBe('Async quote');
      expect(debugEl.query(By.css('.twain__error'))).toBeNull();
    });
  }));

  it('Should show quote after getQuote (marbles)', () => {
    /**
     * Observable test quote value and complete(), after delay
     * Marble testing uses a test scheduler to simulate the passage of time in a synchronous test
     * This test defines a cold observable that waits three frames (---), emits a value (x), and completes (|)
     */
    const q$ = cold('---x|', { x: testQuote });

    twainServiceSpy.getQuote.and.returnValue(q$);

    fixture.detectChanges();

    expect(quoteNativeEl.textContent).toBe('...');

    /** Activate observable defined at line 139 */
    getTestScheduler().flush();

    fixture.detectChanges();
    expect(quoteNativeEl.textContent).toBe(testQuote);
    expect(debugEl.query(By.css('.twain__error'))).toBeNull(
      'should not show error'
    );
  });

  it('Should display error when TwainService fails (marbles)', fakeAsync(() => {
    const q$ = cold('---#|', null, new Error('TwainService test failure'));

    twainServiceSpy.getQuote.and.returnValue(q$);

    fixture.detectChanges();

    expect(quoteNativeEl.textContent).toBe('...');

    getTestScheduler().flush();

    tick();

    fixture.detectChanges();

    expect(
      debugEl.query(By.css('.twain__error')).nativeElement.textContent.trim()
    ).toBe('TwainService test failure');
    expect(quoteNativeEl.textContent).toBe('...');
  }));
});

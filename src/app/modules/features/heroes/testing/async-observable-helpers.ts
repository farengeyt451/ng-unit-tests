import { DebugElement } from '@angular/core';
/*
 * Mock async observables that return asynchronously.
 * The observable either emits once and completes or errors.
 *
 * Must call `tick()` when test with `fakeAsync()`.
 *
 * THE FOLLOWING DON'T WORK
 * Using `of().delay()` triggers TestBed errors;
 * see https://github.com/angular/angular/issues/10127 .
 *
 * Using `asap` scheduler - as in `of(value, asap)` - doesn't work either.
 */
import { defer } from 'rxjs';

/**
 * Create async observable that emits-once and completes
 * after a JS engine turn
 */
export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

/**
 * Create async observable error that errors
 * after a JS engine turn
 */
export function asyncError<T>(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}

/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
export const ButtonClickEvents = {
  left: { button: 0 },
  right: { button: 2 },
};

/** Simulate element click
 * Defaults to mouse left-button click event
 */
export function click(
  el: DebugElement | HTMLElement,
  eventObj: any = ButtonClickEvents.left
) {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}

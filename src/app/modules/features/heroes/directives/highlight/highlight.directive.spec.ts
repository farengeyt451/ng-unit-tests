import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HighlightDirective } from './highlight.directive';

@Component({
  template: ` <h2 highlight="yellow">Something Yellow</h2>
    <h2 highlight>The Default (Gray)</h2>
    <h2>No Highlight</h2>
    <input #box [highlight]="box.value" value="cyan" />`,
})
class TestComponent {}

describe('Directive: HighlightDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directiveDebugEl: DebugElement[];
  let caption: DebugElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [HighlightDirective, TestComponent],
    }).createComponent(TestComponent);

    fixture.detectChanges();

    /** All elements with an attached HighlightDirective */
    directiveDebugEl = fixture.debugElement.queryAll(
      By.directive(HighlightDirective)
    );

    /** Elements without the HighlightDirective */
    caption = fixture.debugElement.query(By.css('h2:not([highlight])'));
  });

  it('Should have three highlighted elements', () => {
    expect(directiveDebugEl.length).toBe(3);
  });

  it('Should color 1st <h2> background "yellow"', () => {
    const bgColor = directiveDebugEl[0].nativeElement.style.backgroundColor;
    expect(bgColor).toBe('yellow');
  });

  it('Should color 2nd <h2> background w/ default color', () => {
    const dir = directiveDebugEl[1].injector.get(
      HighlightDirective
    ) as HighlightDirective;
    const bgColor = directiveDebugEl[1].nativeElement.style.backgroundColor;
    expect(bgColor).toBe(dir['defaultColor']);
  });

  it('Should bind <input> background to value color', () => {
    const input = directiveDebugEl[2].nativeElement as HTMLInputElement;
    expect(input.style.backgroundColor).toBe('cyan', 'initial backgroundColor');

    input.value = 'green';

    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.style.backgroundColor).toBe(
      'green',
      'changed backgroundColor'
    );
  });

  it('bare <h2> should not have a customProperty', () => {
    expect(caption.properties.customProperty).toBeUndefined();
  });

  it('Should inject HighlightDirective in 1st <h2>', () => {
    const dir = directiveDebugEl[0].injector.get(HighlightDirective);
    expect(dir).toBeTruthy();
  });

  it('Should not inject HighlightDirective in 3rd <h2>', () => {
    const dir = caption.injector.get(HighlightDirective, null);
    expect(dir).toBe(null);
  });

  /** DebugElement.providerTokens */
  /** Attached HighlightDirective should be listed in the providerTokens */
  it('should have `HighlightDirective` in 1st <h2> providerTokens', () => {
    expect(directiveDebugEl[0].providerTokens).toContain(HighlightDirective);
  });

  it('Should not have HighlightDirective in 3rd <h2> providerTokens', () => {
    expect(caption.providerTokens).not.toContain(HighlightDirective);
  });
});

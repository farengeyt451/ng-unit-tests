import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { WelcomeComponent } from './welcome.component';
import { UserService } from '../../services/user.service';

class MockUserService {
  isLoggedIn = true;
  user = { name: 'Test User' };
}

/**
 * WelcomeComponent testing
 * It has dependency on UserService
 * Instead real UserService used MockUserService
 */
describe('Component: WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let debugEl: DebugElement;
  let userService: UserService;
  let welcomeEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WelcomeComponent,
        {
          provide: UserService,
          useClass: MockUserService,
        },
      ],
    });

    fixture = TestBed.createComponent(WelcomeComponent);
    debugEl = fixture.debugElement;
    component = debugEl.componentInstance;
    /** Use root injector */
    userService = TestBed.inject(UserService);
    welcomeEl = debugEl.query(By.css('.welcome'));
  });

  it('Should not have welcome message after construction', () => {
    expect(component.welcome).toBeUndefined();
  });

  it('Should welcome logged in user after ngOnInit calling', () => {
    component.ngOnInit();
    expect(component.welcome).toContain(userService.user.name); // 'Test User'
  });

  it('Should ask user to log in if not logged in after ngOnInit', () => {
    userService.isLoggedIn = false;
    component.ngOnInit();
    expect(component.welcome).not.toContain(userService.user.name);
    expect(component.welcome).toContain('log in');
  });

  it('Should welcome the user - DOM', () => {
    fixture.detectChanges();

    expect(welcomeEl).toBeTruthy();
    expect(welcomeEl.nativeElement.textContent).toContain('Welcome');
    expect(welcomeEl.nativeElement.textContent).toContain('Test User');
  });

  it('Should welcome "Budda" - DOM', () => {
    userService.user.name = 'Budda';
    fixture.detectChanges();
    expect(welcomeEl).toBeTruthy();
    expect(welcomeEl.nativeElement.textContent).toContain('Welcome');
    expect(welcomeEl.nativeElement.textContent).toContain('Budda');
  });
});

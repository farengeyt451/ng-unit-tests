import { TestBed } from '@angular/core/testing';
import { UserService } from '../../services/user.service';
import { WelcomeComponent } from './welcome.component';

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
  let userService: UserService;

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

    component = TestBed.inject(WelcomeComponent);
    userService = TestBed.inject(UserService);
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
});

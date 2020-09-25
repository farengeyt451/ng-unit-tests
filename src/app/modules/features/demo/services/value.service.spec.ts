import { async, TestBed } from '@angular/core/testing';
import { ValueService } from './value.service';

/**
 * Test for simple service without dependencies
 *
 */
describe('Service: ValueService', () => {
  let service: ValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValueService],
    });

    service = TestBed.inject(ValueService);
  });

  it('Should create service', () => {
    expect(service).toBeTruthy();
  });

  it('Should return real value: #getValue', () => {
    expect(service.getValue()).toBe('real value');
  });

  it('Should return value from observable: #getObservableValue', () => {
    service.getObservableValue().subscribe((value) => {
      expect(value).toBe('observable value');
    });
  });

  it('Should return value from observable [delay + async]: #getObservableValue', async(() => {
    service.getObservableDelayValue().subscribe((value) => {
      expect(value).toBe('observable delay value');
    });
  }));

  it('Should return value from observable [delay + done]: #getObservableValue', (done: DoneFn) => {
    service.getObservableDelayValue().subscribe((value) => {
      expect(value).toBe('observable delay value');
      done();
    });
  });

  it('Should return value from a promise [done]: #getPromiseValue', (done: DoneFn) => {
    service.getPromiseValue().then((value) => {
      expect(value).toBe('promise value');
      done();
    });
  });

  it('Should return value from a promise [async]: #getPromiseValue', async(() => {
    service.getPromiseValue().then((value) => {
      expect(value).toBe('promise value');
    });
  }));
});

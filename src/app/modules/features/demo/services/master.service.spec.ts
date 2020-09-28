import { TestBed } from '@angular/core/testing';
import { MasterService } from './master.service';
import { ValueService } from './value.service';

class FakeValueService {
  getValue() {
    return 'faked service value';
  }
}

describe('Service: MasterService', () => {
  let masterService: MasterService;

  it('Should return real value from the real service: #getValue ', () => {
    masterService = new MasterService(new ValueService());
    expect(masterService.getValue()).toBe('real value');
  });

  it('Should return faked value from the fake service: #getValue ', () => {
    masterService = new MasterService(new FakeValueService() as ValueService);
    expect(masterService.getValue()).toBe('faked service value');
  });

  it('Should return faked value from a fake object: #getValue', () => {
    const fakeObj = { getValue: () => 'fake value' };
    masterService = new MasterService(fakeObj as ValueService);
    expect(masterService.getValue()).toBe('fake value');
  });

  it('Should return stubbed value from a spy', () => {
    const valueServiceSpy = jasmine.createSpyObj('ValueService', ['getValue']);
    const stubValue = 'stub value';

    /**
     * Jasmine createSpyObj create stub service and spy on methods call
     * Original method will not called
     * Stub value will be returned
     **/
    valueServiceSpy.getValue.and.returnValue(stubValue);
    masterService = new MasterService(valueServiceSpy);

    expect(masterService.getValue()).toBe(stubValue);

    /** Check for stub value to have been called */
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);

    /** Check for stub value to have been called, alternative API */
    expect(valueServiceSpy.getValue.calls.count()).toBe(1);
    expect(valueServiceSpy.getValue.calls.mostRecent().returnValue).toBe(
      stubValue
    );
  });
});

/**
 * MasterService - original
 * ValueService - stub
 **/
describe('Service: MasterService + TestBed', () => {
  let masterService: MasterService;
  let valueServiceSpy: jasmine.SpyObj<ValueService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ValueService', ['getValue']);

    TestBed.configureTestingModule({
      providers: [MasterService, { provide: ValueService, useValue: spy }],
    });

    masterService = TestBed.inject(MasterService);
    valueServiceSpy = TestBed.inject(ValueService) as jasmine.SpyObj<
      ValueService
    >;
  });

  it('Should return stubbed value from a spy: #getValue', () => {
    const stubValue = 'stub value';
    const newStubValue = 'stub value';

    valueServiceSpy.getValue.and.returnValue(stubValue);

    expect(masterService.getValue()).toBe(stubValue);
    expect(valueServiceSpy.getValue.calls.count()).toBe(1);
    expect(valueServiceSpy.getValue.calls.mostRecent().returnValue).toBe(
      stubValue
    );

    valueServiceSpy.getValue.and.returnValue(newStubValue);

    expect(masterService.getValue()).toBe(newStubValue);
    expect(valueServiceSpy.getValue.calls.count()).toBe(2);
    expect(valueServiceSpy.getValue.calls.mostRecent().returnValue).toBe(
      newStubValue
    );
  });
});

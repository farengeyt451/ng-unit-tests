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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MasterService, ValueService],
    });
    masterService = TestBed.inject(MasterService);
  });

  it('Should create service', () => {
    expect(masterService).toBeTruthy();
  });

  it('Should return real value from the real service: #getValue ', () => {
    expect(masterService.getValue()).toBe('real value');
  });
});

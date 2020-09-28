import { LightswitchComponent } from './lightswitch.component';

/** Component class testing */
describe('LightswitchComp', () => {
  it('Should toggle #isOn, when #clicked called', () => {
    const component = new LightswitchComponent();
    expect(component.isOn).toBe(false);
    component.clicked();
    expect(component.isOn).toBe(true);
    component.clicked();
    expect(component.isOn).toBe(false);
  });

  it('Should set #message to "is on" when #clicked called', () => {
    const component = new LightswitchComponent();
    expect(component.message).toMatch(/is off/i);
    component.clicked();
    expect(component.message).toMatch(/is on/i);
  });
});

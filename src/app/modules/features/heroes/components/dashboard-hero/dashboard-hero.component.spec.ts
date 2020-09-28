import { DashboardHeroComponent } from './dashboard-hero.component';
import { Hero } from '../../interfaces/hero.interface';

/**
 * DashboardHeroComponent testing
 * It contains @Input and @Output decorators
 *
 * Testing without creating the DashboardHeroComponent or its parent component
 */
describe('Component: DashboardHeroComponent', () => {
  it('Dispatch the selected event when clicked', () => {
    const component = new DashboardHeroComponent();
    const hero: Hero = { id: 42, name: 'Test' };
    component.hero = hero;

    component.selected.subscribe((selectedHero: Hero) =>
      expect(selectedHero).toBe(hero)
    );
    component.click();
  });
});

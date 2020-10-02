import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Hero } from '../interfaces/hero.interface';
import { HeroService } from './hero-service';

@Injectable()
export class HeroDetailService {
  constructor(private heroService: HeroService) {}

  /** Returns a clone which caller may modify safely */
  getHero(id: number | string): Observable<Hero> {
    if (typeof id === 'string') {
      id = parseInt(id, 10);
    }
    return this.heroService.getHero(id).pipe(
      map((hero) => {
        return hero ? Object.assign({}, hero) : null; // Clone or null
      })
    );
  }

  saveHero(hero: Hero) {
    return this.heroService.updateHero(hero);
  }
}

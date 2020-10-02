import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { asyncData } from './async-observable-helpers';
import { Hero } from '../interfaces/hero.interface';
import { HeroService } from '../services/hero-service';
import { getTestHeroes } from './test-heroes';

@Injectable()
/**
 * FakeHeroService pretends to make real http requests.
 * implements only as much of HeroService as is actually consumed by the app
 */
export class TestHeroService extends HeroService {
  constructor() {
    super(null);
  }

  heroes = getTestHeroes();
  lastResult: Observable<any>; // Result from last method call

  addHero(hero: Hero): Observable<Hero> {
    throw new Error('Method not implemented.');
  }

  deleteHero(hero: number | Hero): Observable<Hero> {
    throw new Error('Method not implemented.');
  }

  getHeroes(): Observable<Hero[]> {
    return (this.lastResult = asyncData(this.heroes));
  }

  getHero(id: number | string): Observable<Hero> {
    if (typeof id === 'string') {
      id = parseInt(id, 10);
    }
    const hero = this.heroes.find((hero) => hero.id === id);
    return (this.lastResult = asyncData(hero));
  }

  updateHero(hero: Hero): Observable<Hero> {
    return (this.lastResult = this.getHero(hero.id).pipe(
      map((hero) => {
        if (hero) {
          return Object.assign(hero, hero);
        }
        throw new Error(`Hero ${hero.id} not found`);
      })
    ));
  }
}

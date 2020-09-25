/* tslint:disable:member-ordering */
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Hero } from '../../interfaces/hero.interface';
import { HeroDetailService } from '../../services/hero-detail.service';

@Component({
  selector: 'hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss'],
  providers: [HeroDetailService],
})
export class HeroDetailComponent implements OnInit {
  constructor(
    private heroDetailService: HeroDetailService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  @Input() hero: Hero;

  ngOnInit(): void {
    // get hero when `id` param changes
    this.route.paramMap.subscribe((pmap) => this.getHero(pmap.get('id')));
  }

  private getHero(id: string): void {
    // when no id or id===0, create new blank hero
    if (!id) {
      this.hero = { id: 0, name: '' } as Hero;
      return;
    }

    this.heroDetailService.getHero(id).subscribe((hero) => {
      if (hero) {
        this.hero = hero;
        console.log(
          'log: HeroDetailComponent -> getHero -> this.hero',
          this.hero
        );
      } else {
        this.gotoList(); // id not found; navigate to list
      }
    });
  }

  onSave(): void {
    this.heroDetailService.saveHero(this.hero).subscribe(() => this.gotoList());
  }

  onCancel() {
    this.gotoList();
  }

  gotoList() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

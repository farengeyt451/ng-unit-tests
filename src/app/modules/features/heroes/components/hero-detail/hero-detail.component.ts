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

  ngOnInit() {
    this.subToRouting();
  }

  private subToRouting() {
    this.route.paramMap.subscribe((paramMap) =>
      this.getHero(Number(paramMap.get('id')))
    );
  }

  private getHero(id: number) {
    if (!id) {
      this.hero = { id: 0, name: '' } as Hero;
      return;
    }

    this.heroDetailService.getHero(id).subscribe((hero) => {
      if (hero) {
        this.hero = hero;
      } else {
        this.gotoList();
      }
    });
  }

  onSave() {
    this.heroDetailService.saveHero(this.hero).subscribe(() => this.gotoList());
  }

  onCancel() {
    this.gotoList();
  }

  gotoList() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

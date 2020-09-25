import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'dashboard-hero',
  templateUrl: './dashboard-hero.component.html',
  styleUrls: ['./dashboard-hero.component.scss'],
})
export class DashboardHeroComponent {
  @Input() hero: Hero;
  @Output() selected = new EventEmitter<Hero>();
  click() {
    this.selected.emit(this.hero);
  }
}

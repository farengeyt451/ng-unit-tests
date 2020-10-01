import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[routerLink]',
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click')
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

/** Dummy module to satisfy Angular Language service */
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [RouterLinkDirectiveStub],
})
export class RouterStubsModule {}

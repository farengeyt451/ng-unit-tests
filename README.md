# Unit tests playground

[![Build Status](https://travis-ci.org/farengeyt451/ng-unit-tests.svg?branch=master)](https://travis-ci.org/farengeyt451/ng-unit-tests)

### Based on official documentation

<!-- prettier-ignore-start -->
```bash
./src
├── app
│   ├── app.component.html
│   ├── app.component.scss
│   ├── app.component.ts
│   ├── app.module.ts
│   ├── app-routing.module.ts
│   ├── interfaces
│   └── modules
│       ├── core
│       │   ├── core.module.ts
│       │   └── guards
│       │       └── module-import.guard.ts
│       ├── features
│       │   ├── demo
│       │   │   ├── components
│       │   │   │   └── lightswitch
│       │   │   │       ├── lightswitch.component.spec.ts (Class testing)
│       │   │   │       └── lightswitch.component.ts
│       │   │   ├── demo.module.ts
│       │   │   └── services
│       │   │       ├── master.service.spec.ts (Service with dependency)
│       │   │       ├── master.service.ts
│       │   │       ├── value.service.spec.ts (Angular TestBed)
│       │   │       └── value.service.ts
│       │   └── heroes
│       │       ├── components
│       │       │   ├── about
│       │       │   │   ├── about.component.html
│       │       │   │   ├── about.component.scss
│       │       │   │   ├── about.component.ts
│       │       │   │   └── index.ts
│       │       │   ├── banner
│       │       │   │   ├── banner.component.html
│       │       │   │   ├── banner.component.scss
│       │       │   │   ├── banner.component.spec.ts (DOM rendering testing, binding)
│       │       │   │   ├── banner.component.ts
│       │       │   │   └── index.ts
│       │       │   ├── dashboard
│       │       │   │   ├── dashboard.component.html
│       │       │   │   ├── dashboard.component.scss
│       │       │   │   ├── dashboard.component.spec.ts (Component: injected Router, HeroService)
│       │       │   │   ├── dashboard.component.ts
│       │       │   │   └── index.ts
│       │       │   ├── dashboard-hero
│       │       │   │   ├── dashboard-hero.component.html
│       │       │   │   ├── dashboard-hero.component.scss
│       │       │   │   ├── dashboard-hero.component.spec.ts (Component with inputs and outputs, inside test host, routing)
│       │       │   │   ├── dashboard-hero.component.ts
│       │       │   │   └── index.ts
│       │       │   ├── hero-detail
│       │       │   │   ├── hero-detail.component.html
│       │       │   │   ├── hero-detail.component.scss
│       │       │   │   ├── hero-detail.component.spec.ts (Routed component)
│       │       │   │   ├── hero-detail.component.ts
│       │       │   │   └── index.ts
│       │       │   ├── hero-list
│       │       │   │   ├── hero-list.component.html
│       │       │   │   ├── hero-list.component.scss
│       │       │   │   ├── hero-list.component.ts
│       │       │   │   ├── hero-list.component.spec.ts (DOM rendering testing, binding)
│       │       │   │   └── index.ts
│       │       │   ├── twain
│       │       │   │   ├── index.ts
│       │       │   │   ├── twain.component.html
│       │       │   │   ├── twain.component.scss
│       │       │   │   ├── twain.component.spec.ts (Component with async service, marble tests)
│       │       │   │   └── twain.component.ts
│       │       │   └── welcome
│       │       │       ├── index.ts
│       │       │       ├── welcome.component.html
│       │       │       ├── welcome.component.scss
│       │       │       ├── welcome.component.spec.ts (Component with a dependency)
│       │       │       └── welcome.component.ts
│       │       ├── directives
│       │       │   └── highlight
│       │       │       ├── highlight.directive.spec.ts (Directive testing)
│       │       │       ├── highlight.directive.ts
│       │       │       └── index.ts
│       │       ├── fixtures
│       │       │   └── twain-data.fixture.ts
│       │       ├── heroes.module.ts
│       │       ├── heroes-routing.module.spec.ts (Router module testing)
│       │       ├── heroes-routing.module.ts
│       │       ├── interfaces
│       │       │   ├── hero.interface.ts
│       │       │   └── quote.interface.ts
│       │       ├── models
│       │       ├── pages
│       │       │   └── heroes-index
│       │       │       ├── heroes-index.component.html
│       │       │       ├── heroes-index.component.scss
│       │       │       ├── heroes-index.component.spec.ts (Nested component tests, router-outlet, RouterLink)
│       │       │       ├── heroes-index.component.ts
│       │       │       └── index.ts
│       │       ├── pipes
│       │       │   └── title-case
│       │       │       ├── index.ts
│       │       │       ├── title-case.pipe.spec.ts (Pipe testing)
│       │       │       └── title-case.pipe.ts
│       │       ├── services
│       │       │   ├── hero-detail.service.ts
│       │       │   └── hero-service
│       │       │   │    ├── index.ts
│       │       │   │    ├── hero.service.ts.spec.ts (Mock service, HttpClientTestingModule)
│       │       │   │    └── hero.service.ts
│       │       │   ├── in-memory-data.service.ts
│       │       │   ├── twain.service.ts
│       │       │   └── user.service.ts
│       │       └── testing
│       │           ├── activated-route-stub.ts
│       │           ├── async-observable-helpers.ts
│       │           ├── index.ts
│       │           ├── router-link-directive-stub.ts
│       │           ├── test-heroes.ts
│       │           └── test-hero.service.ts
│       └── shared
├── assets
├── environments
│   ├── environment.prod.ts
│   └── environment.ts
├── favicon.ico
├── index.html
├── main.ts
├── polyfills.ts
├── styles.scss
└── test.ts

```
<!-- prettier-ignore-end -->

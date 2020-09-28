# Unit tests playground

[![Build Status](https://travis-ci.org/farengeyt451/ng-unit-tests.svg?branch=master)](https://travis-ci.org/farengeyt451/ng-unit-tests)

### Based on official documentation

Lazy loading feature modules

<!-- prettier-ignore-start -->
```bash
./ng-unit-tests/src
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
│       │   │   │       ├── lightswitch.component.spec.ts (test component class)
│       │   │   │       └── lightswitch.component.ts
│       │   │   ├── demo.module.ts
│       │   │   └── services
│       │   │       ├── master.service.spec.ts (test service with dependency)
│       │   │       ├── master.service.ts
│       │   │       ├── value.service.spec.ts (test simple service)
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
│       │       │   │   ├── banner.component.ts
│       │       │   │   └── index.ts
│       │       │   ├── dashboard
│       │       │   │   ├── dashboard.component.html
│       │       │   │   ├── dashboard.component.scss
│       │       │   │   ├── dashboard.component.ts
│       │       │   │   └── index.ts
│       │       │   ├── dashboard-hero
│       │       │   │   ├── dashboard-hero.component.html
│       │       │   │   ├── dashboard-hero.component.scss
│       │       │   │   ├── dashboard-hero.component.spec.ts (test component class)
│       │       │   │   ├── dashboard-hero.component.ts
│       │       │   │   └── index.ts
│       │       │   ├── hero-detail
│       │       │   │   ├── hero-detail.component.html
│       │       │   │   ├── hero-detail.component.scss
│       │       │   │   ├── hero-detail.component.ts
│       │       │   │   └── index.ts
│       │       │   ├── hero-list
│       │       │   │   ├── hero-list.component.html
│       │       │   │   ├── hero-list.component.scss
│       │       │   │   ├── hero-list.component.ts
│       │       │   │   └── index.ts
│       │       │   ├── twain
│       │       │   │   ├── index.ts
│       │       │   │   ├── twain.component.html
│       │       │   │   ├── twain.component.scss
│       │       │   │   └── twain.component.ts
│       │       │   └── welcome
│       │       │       ├── index.ts
│       │       │       ├── welcome.component.html
│       │       │       ├── welcome.component.scss
│       │       │       ├── welcome.component.spec.ts (test component with service)
│       │       │       └── welcome.component.ts
│       │       ├── directives
│       │       │   └── highlight.directive.ts
│       │       ├── fixtures
│       │       │   └── twain-data.fixture.ts
│       │       ├── heroes.module.ts
│       │       ├── heroes-routing.module.ts
│       │       ├── interfaces
│       │       │   ├── hero.interface.ts
│       │       │   └── quote.interface.ts
│       │       ├── models
│       │       ├── pages
│       │       │   └── heroes-index
│       │       │       ├── heroes-index.component.html
│       │       │       ├── heroes-index.component.scss
│       │       │       ├── heroes-index.component.ts
│       │       │       └── index.ts
│       │       └── services
│       │           ├── hero-detail.service.ts
│       │           ├── hero.service.ts
│       │           ├── in-memory-data.service.ts
│       │           ├── twain.service.ts
│       │           └── user.service.ts
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

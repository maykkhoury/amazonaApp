# Amazona Paints App — Detailed Migration Plan  
## Ionic v1 / AngularJS / Cordova → Ionic 7+ / Angular 17+ / Capacitor

**Document version:** 1.0  
**Last updated:** 2025-03-17  
**Target stack:** Ionic 7.x, Angular 17+, Capacitor 5+

---

## 1. Executive Summary

| Aspect | Current | Target |
|--------|---------|--------|
| **UI framework** | Ionic v1 (AngularJS 1.x) | Ionic 7+ (Angular 17+) |
| **Native runtime** | Apache Cordova | Capacitor |
| **Platform** | Android (Cordova), iOS config only | Android + iOS (Capacitor) |
| **Build** | Gulp (SCSS), manual script order | Angular CLI, Ionic CLI |
| **State** | `$rootScope`, global `db` | Angular services, dependency injection |

**Approach:** Phased rewrite (no in-place upgrade). Reuse: schema, sync algorithm, UX flows, assets, and business logic (ported to TypeScript).

**Estimated effort:** 10–16 weeks (one developer, full-time), depending on test coverage and store release process.

---

## 2. Scope and Out-of-Scope

### In scope
- All user-facing screens and navigation (login, home, search, color list, details, color locator, settings, sync, about, contact).
- Local SQLite database: schema, pre-bundled DB copy, and all queries.
- Sync: stopSync/dbSync (amazonapaints.com) and table sync (happywallpaints.com API).
- Login/garage selection and settings (unit, show all hues).
- Theming (garage theme color, logos).
- Android and iOS builds and store-ready artifacts.

### Out of scope (unless explicitly added)
- Backend API changes (migration assumes existing endpoints remain).
- New features not present in the current app.
- Web/PWA as primary target (focus remains native mobile).

---

## 3. Current vs Target — Quick Reference

### 3.1 Routes / states → Angular routes

| Current state (UI-Router) | Route path (suggested) | Page component (suggested) |
|---------------------------|------------------------|----------------------------|
| `app` (abstract + menu) | — | `AppShellComponent` (layout with menu) |
| `app.login` | `/login` | `LoginPage` |
| `app.logout` | `/login` (redirect) | Same as login |
| `app.home` | `/home` | `HomePage` |
| `app.search` | `/search` | `SearchPage` |
| `app.colorlist` | `/colorlist` | `ColorListPage` |
| `app.details` | `/details` | `DetailsPage` |
| `app.colorlocator` | `/colorlocator` | `ColorLocatorPage` |
| `app.colorlocatorresult` | `/colorlocator/result` | `ColorLocatorResultPage` |
| `app.settings` | `/settings` | `SettingsPage` |
| `app.synchapp` | `/sync` | `SyncPage` |
| `app.about` | `/about` | `AboutPage` |
| `app.contactus` | `/contact` | `ContactPage` |

Default route: `/login` (replace `$urlRouterProvider.otherwise('/app/login')`).

### 3.2 Controllers → Pages / components

| Current file | Responsibility | Target |
|--------------|----------------|--------|
| `www/js/controllers/appCtrl.js` | Shell, logout | `AppShellComponent` + `AuthService` |
| `www/js/controllers/loginCtrl.js` | Login form, garage selection | `LoginPage` |
| `www/js/controllers/homeCtrl.js` | Home dashboard | `HomePage` |
| `www/js/controllers/searchCtrl.js` | Car/color search | `SearchPage` |
| `www/js/controllers/colorlistCtrl.js` | Formula list | `ColorListPage` |
| `www/js/controllers/detailsCtrl.js` | Formula details | `DetailsPage` |
| `www/js/controllers/colorlocatorCtrl.js` | Locator input | `ColorLocatorPage` |
| `www/js/controllers/colorlocatorresultCtrl.js` | Locator results | `ColorLocatorResultPage` |
| `www/js/controllers/settingsCtrl.js` | Unit, show all hues | `SettingsPage` |
| `www/js/controllers/synchappCtrl.js` | Sync UI + progress | `SyncPage` |
| `www/js/controllers/aboutCtrl.js` | About content | `AboutPage` |
| `www/js/controllers/contactusCtrl.js` | Contact | `ContactPage` |

### 3.3 Services → Angular services (TypeScript)

| Current file | Purpose | Target service | Notes |
|--------------|---------|----------------|--------|
| `www/js/services/initiateDataService.js` | Insert seed data (browser dev) | `InitiateDataService` or remove | Only used when `sqlitePlugin` undefined; optional in new app. |
| `www/js/services/createTablesService.js` | CREATE TABLE statements | `SchemaService` or migration scripts | Port schema to migration or one-off init. |
| `www/js/services/getAllCarsService.js` | Cars, models, years, locators | `CarRepositoryService` | Pure query port; use async/await. |
| `www/js/services/myLoginService.js` | Garage CRUD, login, theme | `AuthService` + `GarageService` | Split: auth state vs garage data. |
| `www/js/services/MySettingsService` | getChosenGarage (stub), saveShowAllHues | Merge into `AuthService` / `SettingsService` | Current getChosenGarage is stub; real logic in MyLoginService. |
| `www/js/services/myHttpService.js` | stopSync.txt, dbSync.txt (legacy) | `LegacySyncConfigService` or merge into sync | Remove SSL bypass; use HttpClient. |
| `www/js/services/mySyncService.js` | happywallpaints.com API sync | `SyncService` | Move API base + key to env/config. |
| `www/js/services/searchColorsService.js` | Formula colors, equations, units | `FormulaColorsService` | Heavy logic; port with interfaces. |
| `www/js/services/searchFormulasService.js` | Search formulas, variants, RGB | `SearchFormulasService` | Port with typed models. |

### 3.4 Cordova plugins → Capacitor / alternatives

| Cordova plugin | Purpose | Capacitor / approach |
|----------------|---------|----------------------|
| `cordova-sqlite-storage` | SQLite DB | `@capacitor-community/sqlite` or similar |
| `cordova-plugin-dbcopy` | Copy bundled DB from assets | Copy file via Capacitor Filesystem + SQLite init |
| `cordova-plugin-advanced-http` | HTTP with custom options | Angular `HttpClient`; for cert pinning use plugin if needed |
| `cordova-plugin-file` | File paths (cache dir) | `@capacitor/filesystem` |
| `cordova-plugin-device` | Device info | `@capacitor/device` |
| `cordova-plugin-network-information` | Online/offline | `@capacitor/network` or Angular service |
| `cordova-plugin-statusbar` | Status bar | `@capacitor/status-bar` |
| `cordova-plugin-splashscreen` | Splash | `@capacitor/splash-screen` |
| `cordova-plugin-ionic-keyboard` | Keyboard | Capacitor handles by default |
| `cordova-plugin-ionic-webview` | WebView config | N/A (Capacitor uses its own WebView) |

---

## 4. Phase-by-Phase Plan

### Phase 0: Preparation (Week 1)

**Goals:** New repo/project, tooling, and shared contracts.

| # | Task | Deliverable | Owner |
|---|------|-------------|--------|
| 0.1 | Create new Ionic Angular app (tabs or blank), add Capacitor | `amazona-app-ng/` with `ionic start`, Capacitor added | — |
| 0.2 | Configure Angular 17+, Ionic 7, routing (lazy load structure) | `app.routes.ts`, feature modules skeleton | — |
| 0.3 | Document and export current DB schema (from createTablesService + DB file) | `docs/schema.sql` or schema types | — |
| 0.4 | List all API endpoints and headers (amazonapaints, happywallpaints) | `docs/api-contracts.md` | — |
| 0.5 | Set up env/config for API base URL and keys (no keys in code) | `environment.ts`, optional backend proxy | — |
| 0.6 | Copy `amazonaDB-11.db` and resources (icons, splash) to new project | `resources/`, `assets/` | — |

**Exit criteria:** New app runs in browser and on one Android device with Capacitor; schema and API docs exist.

---

### Phase 1: Shell and navigation (Weeks 2–3)

**Goals:** App shell with menu and routing; no real data yet.

| # | Task | Deliverable | Deps |
|---|------|-------------|------|
| 1.1 | Implement app shell with side menu (Ionic 7 `ion-menu`, `ion-router-outlet`) | `AppShellComponent`, menu items | — |
| 1.2 | Define routes for all pages (login, home, search, …) with guards | `app.routes.ts`, optional `AuthGuard` | — |
| 1.3 | Create placeholder pages (empty components) for each route | 12 page components | 1.1, 1.2 |
| 1.4 | Implement menu visibility rules (e.g. Login/Sync when not connected, Home/Color Locator/Logout when connected) | Menu bindings + auth state service stub | 1.1 |
| 1.5 | Port global styles and theme variables from `www/css/*.css` and `scss/ionic.app.scss` | Shared SCSS/variables, one main theme file | — |
| 1.6 | Add StatusBar and SplashScreen (Capacitor) and remove splash after app ready | `AppComponent` or main init | 0.1 |

**Exit criteria:** Navigation works; menu shows correct items; placeholder pages render; splash/status bar behave.

---

### Phase 2: Data layer — SQLite and schema (Weeks 3–5)

**Goals:** DB available on device; schema and bundled DB copy; no Cordova.

| # | Task | Deliverable | Deps |
|---|------|-------------|------|
| 2.1 | Choose and integrate Capacitor SQLite plugin (e.g. `@capacitor-community/sqlite`) | SQLite wrapper service, init on platform ready | 0.1 |
| 2.2 | Implement “copy bundled DB from assets to app storage” (replace dbcopy plugin) | `DatabaseInitService`: copy + open | 2.1, 0.6 |
| 2.3 | Port all CREATE TABLE logic (createTablesService + any missing from DB) | Schema migration or single init script | 0.3 |
| 2.4 | Expose a single “DB handle” or connection factory used by all services (no global) | `DatabaseService` or `DbConnection` injectable | 2.1, 2.2 |
| 2.5 | Implement repository for `garage`: get chosen, set/cancel chosen, get by key/username | `GarageRepository` (or inside AuthService) | 2.4 |
| 2.6 | Implement repository for `car`, `colorLocator`: getCars, getCarNamesWithLocators, getCarModels, getCarYears, getLocators | `CarRepositoryService` | 2.4 |
| 2.7 | (Optional) Keep browser fallback: use in-memory or mock DB for `ng serve` | Mock or SQL.js in dev | 2.4 |

**Exit criteria:** App opens DB on device; bundled DB is copied and used; repositories return correct data for garage and cars/locators.

---

### Phase 3: Auth and settings (Weeks 4–5)

**Goals:** Login flow and settings reflected in app state and DB.

| # | Task | Deliverable | Deps |
|---|------|-------------|------|
| 3.1 | Implement `AuthService`: setChosenGarage, cancelChosenGarage, getChosenGarage (from DB), and an observable “current garage” / “isLoggedIn” | `AuthService` | 2.5 |
| 3.2 | Port `MyLoginService.doLogin` (query garage, build chosenGarage object, theme color, apply_equation flags) | Used by AuthService or LoginPage | 2.5 |
| 3.3 | Build Login page: form, validation, call AuthService, redirect to home on success | `LoginPage` | 1.3, 3.1 |
| 3.4 | Implement logout (cancel chosen garage, clear state, redirect to login) | Shell or AuthService | 1.4, 3.1 |
| 3.5 | Port `MySettingsService.saveShowAllHues` and unit preference; load/save from DB and app state | `SettingsService` | 2.5 |
| 3.6 | Build Settings page (unit selector, “show all hues” toggle) | `SettingsPage` | 1.3, 3.5 |

**Exit criteria:** User can log in (garage selection), see home when connected, change settings, and logout.

---

### Phase 4: Search and formula list (Weeks 5–7)

**Goals:** Search by car/model/year and show formula list and details.

| # | Task | Deliverable | Deps |
|---|------|-------------|------|
| 4.1 | Port `SearchFormulasService` (concatResults, affectFormulas, setVariants, argbToRGB, setRGBPercentage, getDDMMYYYY, search queries) to TypeScript with interfaces | `SearchFormulasService` | 2.4 |
| 4.2 | Build Search page: car/model/year pickers (from CarRepository), search button, navigate to color list with search params | `SearchPage` | 2.6, 4.1 |
| 4.3 | Port `SearchColorsService` (search, applyEquation, setToKiloConverter, unit conversion) to TypeScript | `FormulaColorsService` (or keep name SearchColorsService) | 2.4, 3.1 |
| 4.4 | Build Color list page: receive search params, call SearchFormulasService, display list, navigate to details with formula | `ColorListPage` | 4.1, 1.3 |
| 4.5 | Build Details page: load formula colors via SearchColorsService, display formula details and color breakdown | `DetailsPage` | 4.3, 3.1 |

**Exit criteria:** Full flow: Search → Color list → Details with correct data and units/equations.

---

### Phase 5: Color locator (Weeks 7–8)

**Goals:** Color locator flow end-to-end.

| # | Task | Deliverable | Deps |
|---|------|-------------|------|
| 5.1 | Port `getAllCarsService.getCarNamesWithLocators`, getCarModels, getCarYears, getLocators | Already in CarRepositoryService | 2.6 |
| 5.2 | Build Color locator page: car/model/year selection, optional locator input, navigate to result with params | `ColorLocatorPage` | 5.1 |
| 5.3 | Build Color locator result page: use locators data and display (port logic from colorlocatorresultCtrl) | `ColorLocatorResultPage` | 5.1 |

**Exit criteria:** Color locator and result screens work with real DB data.

---

### Phase 6: Sync (Weeks 8–10)

**Goals:** Replace Cordova HTTP with Angular HttpClient; secure config; same sync behavior.

| # | Task | Deliverable | Deps |
|---|------|-------------|------|
| 6.1 | Implement config service: read API base URL and key from environment or remote config (no hardcoded key) | `SyncConfigService` or env | 0.5 |
| 6.2 | Port “stopSync” / “dbSync” logic (myHttpService) to HttpClient; remove `setSSLCertMode('nocheck')` and HTTP fallback | `LegacySyncConfigService` or part of `SyncService` | 6.1 |
| 6.3 | Port MySyncService: getTables, syncAllTables, saveRowsToDb, updateAppSyncTable; use Capacitor SQLite and HttpClient | `SyncService` | 2.4, 6.1 |
| 6.4 | Build Sync page: trigger sync, show progress, handle errors | `SyncPage` | 6.3 |
| 6.5 | (Optional) Retry logic for SSL/network errors without disabling cert validation | Same as current retry, but no nocheck | 6.2, 6.3 |

**Exit criteria:** Sync runs against real APIs with env-based config; progress and errors shown; DB updated.

---

### Phase 7: Remaining screens and polish (Weeks 10–11)

**Goals:** About, Contact, Home; theming and assets.

| # | Task | Deliverable | Deps |
|---|------|-------------|------|
| 7.1 | Build Home page (port content from homeCtrl / home.html) | `HomePage` | 3.1 |
| 7.2 | Build About and Contact pages (static content + mailto/tel links) | `AboutPage`, `ContactPage` | 1.3 |
| 7.3 | Apply garage theme color and logo in shell/header (port from current app) | Theming in shell and where used | 3.1 |
| 7.4 | Replace all dev-only code (e.g. DROP table in app.run for browser), debugger, excessive console.log | Clean run path for production | — |
| 7.5 | Finalize icons and splash for Android and iOS (Capacitor resources) | Store-ready assets | 0.6 |

**Exit criteria:** All screens implemented; theme applied; no dev-only branches in production path.

---

### Phase 8: Security and hardening (Weeks 11–12)

**Goals:** Harden config and runtime.

| # | Task | Deliverable | Deps |
|---|------|-------------|------|
| 8.1 | Tighten Content-Security-Policy (remove `default-src *`, avoid `unsafe-inline`/`unsafe-eval` where possible) | `index.html` or server CSP | — |
| 8.2 | Restrict `allow-navigation` and `access origin` in Capacitor config to required origins only | `capacitor.config.ts` / `config.xml` | — |
| 8.3 | Ensure no API keys or secrets in front-end code; use env or backend proxy | Verified env/build approach | 6.1 |
| 8.4 | Enable cleartext only if strictly required for a specific host; otherwise use HTTPS only | Android network config | 6.2 |

**Exit criteria:** Security checklist signed off; no secrets in repo.

---

### Phase 9: Testing and release (Weeks 12–16)

**Goals:** Regression coverage and store submission.

| # | Task | Deliverable | Deps |
|---|------|-------------|------|
| 9.1 | Add unit tests for services (repositories, Auth, Sync, SearchFormulas, SearchColors) | Jest or Karma tests | 2–6 |
| 9.2 | Add integration tests for critical flows (login → search → details; sync) | E2E or integration tests | 4–6 |
| 9.3 | Manual test matrix: Android/iOS, online/offline, first install vs upgrade | Test report | All |
| 9.4 | Version and build numbers; prepare store listings and release notes | Store packages | 7.5 |
| 9.5 | Submit to Google Play and App Store (or internal track) | Published or internal build | 9.3, 9.4 |

**Exit criteria:** Tests green; manual matrix passed; build submitted (or delivered for submission).

---

## 5. File and Asset Migration Checklist

### 5.1 Copy as-is (then adapt paths)
- [ ] `resources/android/` (icons, splash, `network_security_config.xml`)
- [ ] `resources/ios/` (icons, splash) if you add iOS
- [ ] `www/img/` (e.g. `img/core/logo-lg.png`)
- [ ] `amazonaDB-11.db` (or latest) → `assets/data/` or equivalent in new project

### 5.2 Port logic only (no direct copy)
- [ ] `www/js/app.js` → routing + run logic → `app.routes.ts`, `AppComponent`, `DatabaseInitService`, `AuthService` bootstrap
- [ ] `www/js/controllers/*.js` → page components and shell
- [ ] `www/js/services/*.js` → Angular services (see §3.3)
- [ ] `www/templates/*.html` → component templates (ion-components and structure updated to Ionic 7)

### 5.3 Styles
- [ ] `www/css/style.css`, `menu.css`, `login.css`, `home.css`, etc. → global + page-specific SCSS in new app
- [ ] `scss/ionic.app.scss` → theme variables in Angular (e.g. `theme/variables.scss`)

### 5.4 Remove or replace
- [ ] All `www/lib/ionic/*` (Ionic 1) — replaced by `@ionic/angular` in node_modules
- [ ] `cordova.js`, `ng-cordova.min.js` — replaced by Capacitor and Angular HttpClient
- [ ] `gulpfile.js` — replaced by Angular CLI build
- [ ] `config.xml` (Cordova) — replaced by `capacitor.config.ts` and `ionic.config.json`

---

## 6. Risk and Mitigation

| Risk | Mitigation |
|------|------------|
| Schema or query difference after port | Run both apps against same DB file in dev; compare key screens. |
| Sync API key or URL wrong in new app | Use same env shape as other apps; test sync in staging first. |
| Performance (large formula/color lists) | Use virtual scrolling (`ion-virtual-scroll` or Angular CDK) where needed. |
| iOS build or permissions | Start iOS early (Phase 1–2); fix entitlements and Info.plist in parallel. |
| Regression in equation/unit logic | Unit test SearchColorsService and SearchFormulasService with golden data. |

---

## 7. Success Criteria (Overall)

1. **Feature parity:** All current screens and flows work (login, search, color list, details, color locator, settings, sync, about, contact).
2. **Data integrity:** Same SQLite schema and query results for garage, cars, formulas, colors, and sync.
3. **Security:** No TLS bypass, no hardcoded secrets, stricter CSP and navigation rules.
4. **Platforms:** Android and iOS (if in scope) build and run via Capacitor.
5. **Maintainability:** TypeScript, Angular modules, and clear separation between UI, repositories, and sync.

---

## 8. Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-03-17 | Initial detailed migration plan |

---

*End of migration plan.*

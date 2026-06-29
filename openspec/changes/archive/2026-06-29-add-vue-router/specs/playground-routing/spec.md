## ADDED Requirements

### Requirement: Playground pages are accessible via URL routes
The playground SHALL expose each major page as a distinct URL route using vue-router.

#### Scenario: Navigate to Foundations via URL
- **WHEN** user visits `/foundations` in the browser
- **THEN** the FoundationsPage component is rendered

#### Scenario: Navigate to Catalog via URL
- **WHEN** user visits `/catalog` in the browser
- **THEN** the ComponentsCatalogPage component is rendered

#### Scenario: Navigate to Docs via URL
- **WHEN** user visits `/docs` in the browser
- **THEN** the DocumentationPage component is rendered

#### Scenario: Home route renders landing page
- **WHEN** user visits `/` in the browser
- **THEN** the home/landing page (hero + bento grid) is rendered

### Requirement: Header navigation uses router links
The header navigation buttons SHALL use `<router-link>` or `router.push()` instead of state-based click handlers.

#### Scenario: Header nav navigates to correct route
- **WHEN** user clicks "Foundations" in the header nav
- **THEN** browser navigates to `/foundations` and FoundationsPage is rendered

#### Scenario: Active route is reflected in header nav
- **WHEN** user is on the Catalog page (`/catalog`)
- **THEN** the "Components" button in the header nav has an active/selected state

### Requirement: Browser back/forward navigation works
The playground SHALL support browser history navigation (back/forward buttons).

#### Scenario: Back button returns to previous page
- **WHEN** user navigates from Home to Catalog, then clicks browser Back
- **THEN** the browser returns to Home (`/`)

#### Scenario: Forward button re-enters page
- **WHEN** user navigates from Home to Catalog, clicks Back, then clicks Forward
- **THEN** the browser returns to Catalog (`/catalog`)

### Requirement: Catalog component selection via URL hash
The Components Catalog SHALL reflect the selected component in the URL hash.

#### Scenario: Selecting a component updates hash
- **WHEN** user clicks "Button" in the catalog sidebar
- **THEN** the URL hash changes to `#catalog-Button`

#### Scenario: Visiting catalog with hash renders correct component
- **WHEN** user visits `/catalog#catalog-Button`
- **THEN** the Button component demo is displayed

### Requirement: Mobile category nav navigates via router
The PlaygroundCategoryNav component (mobile) SHALL trigger router navigation instead of emitting state events.

#### Scenario: Mobile nav navigates to Foundations
- **WHEN** user selects "Foundations" in the mobile category nav
- **THEN** browser navigates to `/foundations`

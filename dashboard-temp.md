# Multi-Role Dashboard Plan

## Approach

**One shared layout shell → role-specific sidebar components → separate page folders → separate backend route groups.**

The existing `AppShell` + `AppContent` + `AppSidebarHeader` chain stays untouched. We introduce a thin
`RoleAppSidebarLayout` that accepts a `sidebar` prop so each role gets its own sidebar injected without
duplicating the shell structure. Settings pages keep using the original `AppSidebarLayout` unchanged.

---

## Final File Structure

```
resources/js/
├── components/
│   └── sidebars/                          ← NEW
│       ├── admin-sidebar.tsx
│       ├── hotel-manager-sidebar.tsx
│       ├── ferry-operator-sidebar.tsx
│       └── visitor-sidebar.tsx
│
├── layouts/
│   └── app/
│       ├── app-sidebar-layout.tsx         ← unchanged (used by settings)
│       └── role-sidebar-layout.tsx        ← NEW shared base (accepts sidebar prop)
│
└── pages/
    ├── admin/                             ← NEW
    │   └── dashboard.tsx
    ├── hotel-manager/                     ← NEW
    │   └── dashboard.tsx
    ├── ferry-operator/                    ← NEW
    │   └── dashboard.tsx
    └── visitor/                           ← NEW
        └── dashboard.tsx
```

---

## Step-by-Step Implementation

### Step 1 — Shared Role Layout

Create `resources/js/layouts/app/role-sidebar-layout.tsx`.

It mirrors `app-sidebar-layout.tsx` but accepts a `sidebar` prop (a React component) so each role injects
its own sidebar:

```tsx
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';
import type { ComponentType } from 'react';

type Props = AppLayoutProps & {
    sidebar: ComponentType;
};

export default function RoleSidebarLayout({ children, breadcrumbs = [], sidebar: Sidebar }: Props) {
    return (
        <AppShell variant="sidebar">
            <Sidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
```

---

### Step 2 — Role-Specific Sidebar Components

Create one file per role under `resources/js/components/sidebars/`. Each file defines that role's
`mainNavItems` array and exports a sidebar component using the same `Sidebar`, `NavMain`, `NavUser`,
`NavFooter` primitives that `AppSidebar` already uses.

**Placeholder nav items to use now (real routes added later):**

| Role | Placeholder links |
|---|---|
| Admin | Dashboard, Users, Reports |
| Hotel Manager | Dashboard, My Hotels, Bookings |
| Ferry Operator | Dashboard, Ferries, Schedules |
| Visitor | Dashboard, Browse, My Bookings |

Each sidebar component signature:
```tsx
export function AdminSidebar() { ... }
```

---

### Step 3 — Role-Specific Page Folders & Dashboard Pages

Create `resources/js/pages/{role}/dashboard.tsx` for each role.

Each page:
1. Imports its role layout from `role-sidebar-layout.tsx`, passing the matching sidebar
2. Defines `Dashboard.layout` with the breadcrumb
3. Renders the same placeholder grid that `pages/dashboard.tsx` currently uses

Example (admin):
```tsx
import RoleSidebarLayout from '@/layouts/app/role-sidebar-layout';
import { AdminSidebar } from '@/components/sidebars/admin-sidebar';

export default function Dashboard() { ... }

Dashboard.layout = (page) => (
    <RoleSidebarLayout sidebar={AdminSidebar} breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }]}>
        {page}
    </RoleSidebarLayout>
);
```

---

### Step 4 — Backend Role Middleware

The project already has `config/permission.php` and `database/migrations/..._create_permission_tables.php`
which means **Spatie Laravel Permission** is set up.

 use Spatie's built-in `role:` middleware alias to gate each route group:

```php
// Spatie registers this alias automatically:
Route::middleware(['auth', 'verified', 'role:admin'])-> ...
```

Run the `RolePermissionSeeder` to seed the four roles into the database before testing.

---

### Step 5 — Backend Route Groups

Update `routes/web.php` with four role-gated prefix groups:

```php
// Admin
Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::inertia('dashboard', 'admin/dashboard')->name('dashboard');
    });

// Hotel Manager
Route::middleware(['auth', 'verified', 'role:hotel_manager'])
    ->prefix('hotel-manager')
    ->name('hotel-manager.')
    ->group(function () {
        Route::inertia('dashboard', 'hotel-manager/dashboard')->name('dashboard');
    });

// Ferry Operator
Route::middleware(['auth', 'verified', 'role:ferry_operator'])
    ->prefix('ferry-operator')
    ->name('ferry-operator.')
    ->group(function () {
        Route::inertia('dashboard', 'ferry-operator/dashboard')->name('dashboard');
    });

// Visitor
Route::middleware(['auth', 'verified', 'role:visitor'])
    ->prefix('visitor')
    ->name('visitor.')
    ->group(function () {
        Route::inertia('dashboard', 'visitor/dashboard')->name('dashboard');
    });
```

---

### Step 6 — Post-Login Role Redirect

Override Fortify's `LoginResponse` to redirect users to their role-specific dashboard after login.

Create `app/Http/Responses/LoginResponse.php`:

```php
class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();

        $route = match(true) {
            $user->hasRole('admin')          => route('admin.dashboard'),
            $user->hasRole('hotel_manager')  => route('hotel-manager.dashboard'),
            $user->hasRole('ferry_operator') => route('ferry-operator.dashboard'),
            default                          => route('visitor.dashboard'),
        };

        return redirect()->intended($route);
    }
}
```

Bind it in `FortifyServiceProvider`:
```php
$this->app->singleton(LoginResponseContract::class, LoginResponse::class);
```

---

### Step 7 — Wayfinder Route Generation

After adding the new named routes, regenerate Wayfinder's typed route functions:

```bash
php artisan wayfinder:generate
```

Then update sidebar `href` values to use the generated `adminDashboard()`, `hotelManagerDashboard()`, etc.
functions instead of hardcoded strings.

---

## What This Does NOT Change

- `app-sidebar.tsx` — kept as-is, still used implicitly by `app-layout.tsx`
- `app-sidebar-layout.tsx` — kept as-is, still used by settings pages
- All existing auth/settings routes — untouched
- The `dashboard` route (`/dashboard`) — can be kept as a fallback or removed once all roles are seeded

---

## Open Questions (decide before implementing)

1. **Role names in DB** — confirm exact slugs: `admin`, `hotel_manager`, `ferry_operator`, `visitor`?
2. **Visitor access** — should unauthenticated users reach a public browse page, or must they log in first?
3. **Old `/dashboard` route** — keep as fallback, redirect based on role, or delete?

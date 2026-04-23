import { Anchor, CalendarDays, LayoutGrid } from 'lucide-react';
import { RoleSidebar } from '@/components/sidebars/role-sidebar';
import { dashboard } from '@/routes/ferry-operator';
import type { NavItem } from '@/types';

const navItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard.url(), icon: LayoutGrid },
    { title: 'Ferries', href: '#', icon: Anchor },
    { title: 'Schedules', href: '#', icon: CalendarDays },
];

export function FerryOperatorSidebar() {
    return <RoleSidebar homeHref={dashboard.url()} navItems={navItems} />;
}

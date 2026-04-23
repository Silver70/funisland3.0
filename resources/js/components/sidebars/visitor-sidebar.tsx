import { Compass, LayoutGrid, Ticket } from 'lucide-react';
import { RoleSidebar } from '@/components/sidebars/role-sidebar';
import { dashboard } from '@/routes/visitor';
import type { NavItem } from '@/types';

const navItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard.url(), icon: LayoutGrid },
    { title: 'Browse', href: '#', icon: Compass },
    { title: 'My Bookings', href: '#', icon: Ticket },
];

export function VisitorSidebar() {
    return <RoleSidebar homeHref={dashboard.url()} navItems={navItems} />;
}

import { BookOpen, Building2, LayoutGrid } from 'lucide-react';
import { RoleSidebar } from '@/components/sidebars/role-sidebar';
import { dashboard } from '@/routes/hotel-manager';
import type { NavItem } from '@/types';

const navItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard.url(), icon: LayoutGrid },
    { title: 'My Hotels', href: '#', icon: Building2 },
    { title: 'Bookings', href: '#', icon: BookOpen },
];

export function HotelManagerSidebar() {
    return <RoleSidebar homeHref={dashboard.url()} navItems={navItems} />;
}

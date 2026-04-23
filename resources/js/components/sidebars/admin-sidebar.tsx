import { BarChart3, LayoutGrid, Users } from 'lucide-react';
import { RoleSidebar } from '@/components/sidebars/role-sidebar';
import { dashboard } from '@/routes/admin';
import type { NavItem } from '@/types';

const navItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard.url(), icon: LayoutGrid },
    { title: 'Users', href: '#', icon: Users },
    { title: 'Reports', href: '#', icon: BarChart3 },
];

export function AdminSidebar() {
    return <RoleSidebar homeHref={dashboard.url()} navItems={navItems} />;
}

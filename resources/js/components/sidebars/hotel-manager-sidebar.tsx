import { BookOpen, Building2, BedDouble, LayoutGrid } from 'lucide-react';
import { RoleSidebar } from '@/components/sidebars/role-sidebar';
import { index as bookingsIndex } from '@/routes/hotel-manager/bookings';
import { dashboard } from '@/routes/hotel-manager';
import { index as roomsIndex } from '@/routes/hotel-manager/rooms';
import { index as roomTypesIndex } from '@/routes/hotel-manager/room-types';
import type { NavItem } from '@/types';

const navItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard.url(), icon: LayoutGrid },
    { title: 'Room Types', href: roomTypesIndex.url(), icon: Building2 },
    { title: 'Rooms', href: roomsIndex.url(), icon: BedDouble },
    { title: 'Bookings', href: bookingsIndex.url(), icon: BookOpen },
];

export function HotelManagerSidebar() {
    return <RoleSidebar homeHref={dashboard.url()} navItems={navItems} />;
}

import { HotelManagerSidebar } from '@/components/sidebars/hotel-manager-sidebar';
import RoleSidebarLayout from '@/layouts/app/role-sidebar-layout';
import type { AppLayoutProps } from '@/types';

export default function HotelManagerLayout({ breadcrumbs = [], children }: AppLayoutProps) {
    return (
        <RoleSidebarLayout breadcrumbs={breadcrumbs} sidebar={HotelManagerSidebar}>
            {children}
        </RoleSidebarLayout>
    );
}

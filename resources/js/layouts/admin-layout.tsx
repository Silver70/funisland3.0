import { AdminSidebar } from '@/components/sidebars/admin-sidebar';
import RoleSidebarLayout from '@/layouts/app/role-sidebar-layout';
import type { AppLayoutProps } from '@/types';

export default function AdminLayout({ breadcrumbs = [], children }: AppLayoutProps) {
    return (
        <RoleSidebarLayout breadcrumbs={breadcrumbs} sidebar={AdminSidebar}>
            {children}
        </RoleSidebarLayout>
    );
}

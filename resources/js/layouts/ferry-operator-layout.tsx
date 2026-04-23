import { FerryOperatorSidebar } from '@/components/sidebars/ferry-operator-sidebar';
import RoleSidebarLayout from '@/layouts/app/role-sidebar-layout';
import type { AppLayoutProps } from '@/types';

export default function FerryOperatorLayout({ breadcrumbs = [], children }: AppLayoutProps) {
    return (
        <RoleSidebarLayout breadcrumbs={breadcrumbs} sidebar={FerryOperatorSidebar}>
            {children}
        </RoleSidebarLayout>
    );
}

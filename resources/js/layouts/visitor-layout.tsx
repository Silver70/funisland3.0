import { VisitorSidebar } from '@/components/sidebars/visitor-sidebar';
import RoleSidebarLayout from '@/layouts/app/role-sidebar-layout';
import type { AppLayoutProps } from '@/types';

export default function VisitorLayout({ breadcrumbs = [], children }: AppLayoutProps) {
    return (
        <RoleSidebarLayout breadcrumbs={breadcrumbs} sidebar={VisitorSidebar}>
            {children}
        </RoleSidebarLayout>
    );
}

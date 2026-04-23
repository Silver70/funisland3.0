import type { ComponentType } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';


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

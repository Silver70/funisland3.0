import { Head, router } from '@inertiajs/react';
import { updateRole } from '@/actions/App/Http/Controllers/Admin/UserManagementController';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard, userList } from '@/routes/admin';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    roles: Role[];
}

interface Props {
    users: User[];
    roles: Role[];
}

function RoleSelect({ user, roles }: { user: User; roles: Role[] }) {
    const currentRole = user.roles[0]?.name ?? '';

    function handleChange(roleName: string) {
        router.put(updateRole.url(user), { role: roleName }, { preserveScroll: true });
    }

    return (
        <Select value={currentRole} onValueChange={handleChange}>
            <SelectTrigger size="sm" className="w-36">
                <SelectValue placeholder="No role" />
            </SelectTrigger>
            <SelectContent>
                {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                        {role.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export default function UserListPage({ users, roles }: Props) {
    return (
        <>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full text-sm">
                        <thead className="border-b border-sidebar-border/70 bg-muted/50 dark:border-sidebar-border">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">#</th>
                                <th className="px-4 py-3 text-left font-medium">Name</th>
                                <th className="px-4 py-3 text-left font-medium">Email</th>
                                <th className="px-4 py-3 text-left font-medium">Role</th>
                                <th className="px-4 py-3 text-left font-medium">Verified</th>
                                <th className="px-4 py-3 text-left font-medium">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-sidebar-border/40 last:border-0 dark:border-sidebar-border/40"
                                >
                                    <td className="px-4 py-3 text-muted-foreground">{user.id}</td>
                                    <td className="px-4 py-3 font-medium">{user.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <RoleSelect user={user} roles={roles} />
                                    </td>
                                    <td className="px-4 py-3">
                                        {user.email_verified_at ? (
                                            <span className="text-green-600 dark:text-green-400">Yes</span>
                                        ) : (
                                            <span className="text-muted-foreground">No</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

UserListPage.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'Users', href: userList.url() },
    ],
};

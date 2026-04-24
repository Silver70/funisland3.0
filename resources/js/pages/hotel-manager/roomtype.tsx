import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const PER_PAGE = 10;
import { destroy, store, update } from '@/actions/App/Http/Controllers/Hotel/RoomTypeController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes/hotel-manager';
import { index } from '@/routes/hotel-manager/room-types';

interface RoomType {
    id: number;
    name: string;
    description: string | null;
    base_price_per_night: number;
    max_occupancy: number;
}

interface Props {
    roomtype: RoomType[];
}

function RoomTypeForm({
    data,
    setData,
    errors,
}: {
    data: { name: string; description: string; base_price_per_night: number; max_occupancy: number };
    setData: (key: string, value: string | number) => void;
    errors: Partial<Record<string, string>>;
}) {
    return (
        <div className="grid gap-4">
            <div className="grid gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    aria-invalid={!!errors.name}
                />
                {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="description">Description</Label>
                <textarea
                    id="description"
                    rows={3}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                />
                {errors.description && <p className="text-destructive text-xs">{errors.description}</p>}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="base_price_per_night">Price per Night (£)</Label>
                <Input
                    id="base_price_per_night"
                    type="number"
                    min="0"
                    step="0.01"
                    value={data.base_price_per_night}
                    onChange={(e) => setData('base_price_per_night', parseFloat(e.target.value) || 0)}
                    aria-invalid={!!errors.base_price_per_night}
                />
                {errors.base_price_per_night && (
                    <p className="text-destructive text-xs">{errors.base_price_per_night}</p>
                )}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="max_occupancy">Max Occupancy</Label>
                <Input
                    id="max_occupancy"
                    type="number"
                    min="1"
                    max="20"
                    value={data.max_occupancy}
                    onChange={(e) => setData('max_occupancy', parseInt(e.target.value) || 1)}
                    aria-invalid={!!errors.max_occupancy}
                />
                {errors.max_occupancy && (
                    <p className="text-destructive text-xs">{errors.max_occupancy}</p>
                )}
            </div>
        </div>
    );
}

export default function RoomTypePage({ roomtype }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<RoomType | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<RoomType | null>(null);
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(roomtype.length / PER_PAGE));
    const paginated = roomtype.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const createForm = useForm({
        name: '',
        description: '',
        base_price_per_night: 0,
        max_occupancy: 1,
    });

    const editForm = useForm({
        name: '',
        description: '',
        base_price_per_night: 0,
        max_occupancy: 1,
    });

    function openEdit(rt: RoomType) {
        editForm.setData({
            name: rt.name,
            description: rt.description ?? '',
            base_price_per_night: rt.base_price_per_night,
            max_occupancy: rt.max_occupancy,
        });
        setEditTarget(rt);
    }

    function confirmDelete() {
        if (!deleteTarget) {
            return;
        }

        router.delete(destroy.url(deleteTarget), {
            onSuccess: () => setDeleteTarget(null),
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Room Types" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Room Types</h1>
                    <Button size="sm" onClick={() => setCreateOpen(true)}>
                        Add Room Type
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full text-sm">
                        <thead className="border-b border-sidebar-border/70 bg-muted/50 dark:border-sidebar-border">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">#</th>
                                <th className="px-4 py-3 text-left font-medium">Name</th>
                                <th className="px-4 py-3 text-left font-medium">Description</th>
                                <th className="px-4 py-3 text-left font-medium">Price / Night</th>
                                <th className="px-4 py-3 text-left font-medium">Max Occupancy</th>
                                <th className="px-4 py-3 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((type) => (
                                <tr
                                    key={type.id}
                                    className="border-b border-sidebar-border/40 last:border-0 dark:border-sidebar-border/40"
                                >
                                    <td className="px-4 py-3 text-muted-foreground">{type.id}</td>
                                    <td className="px-4 py-3 font-medium">{type.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {type.description ?? <span className="italic">—</span>}
                                    </td>
                                    <td className="px-4 py-3">£{Number(type.base_price_per_night).toFixed(2)}</td>
                                    <td className="px-4 py-3">{type.max_occupancy}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => openEdit(type)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => setDeleteTarget(type)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {roomtype.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No room types found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {roomtype.length > 0 && (
                        <div className="flex items-center justify-between border-t border-sidebar-border/70 px-4 py-3 text-sm dark:border-sidebar-border">
                            <span className="text-muted-foreground">
                                Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, roomtype.length)} of {roomtype.length}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={page === 1}
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    Previous
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={page === totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Room Type</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            createForm.post(store.url(), {
                                onSuccess: () => {
                                    setCreateOpen(false);
                                    createForm.reset();
                                },
                                preserveScroll: true,
                            });
                        }}
                    >
                        <RoomTypeForm
                            data={createForm.data}
                            setData={createForm.setData}
                            errors={createForm.errors}
                        />
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Room Type</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            editForm.put(update.url(editTarget!), {
                                onSuccess: () => setEditTarget(null),
                                preserveScroll: true,
                            });
                        }}
                    >
                        <RoomTypeForm
                            data={editForm.data}
                            setData={editForm.setData}
                            errors={editForm.errors}
                        />
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setEditTarget(null)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Room Type</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This
                        action cannot be undone.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

RoomTypePage.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'Room Types', href: index.url() },
    ],
};

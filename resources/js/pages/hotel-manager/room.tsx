import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { destroy, store, update } from '@/actions/App/Http/Controllers/Hotel/RoomController';
import { Badge } from '@/components/ui/badge';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes/hotel-manager';
import { index } from '@/routes/hotel-manager/rooms';

interface RoomType {
    id: number;
    name: string;
}

interface Room {
    id: number;
    room_number: string;
    status: string;
    room_type_id: number;
    room_type: RoomType;
}

interface Props {
    rooms: Room[];
    roomTypes: RoomType[];
}

const ROOM_STATUSES = ['available', 'occupied', 'maintenance'] as const;

const statusStyles: Record<string, string> = {
    available: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400',
    occupied: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
    maintenance: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
};

function RoomForm({
    data,
    setData,
    errors,
    roomTypes,
}: {
    data: { room_number: string; room_type_id: string; status: string };
    setData: (key: string, value: string) => void;
    errors: Partial<Record<string, string>>;
    roomTypes: RoomType[];
}) {
    return (
        <div className="grid gap-4">
            <div className="grid gap-1.5">
                <Label htmlFor="room_number">Room Number</Label>
                <Input
                    id="room_number"
                    value={data.room_number}
                    onChange={(e) => setData('room_number', e.target.value)}
                    aria-invalid={!!errors.room_number}
                />
                {errors.room_number && <p className="text-destructive text-xs">{errors.room_number}</p>}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="room_type_id">Room Type</Label>
                <Select value={data.room_type_id} onValueChange={(v) => setData('room_type_id', v)}>
                    <SelectTrigger id="room_type_id" className="w-full" aria-invalid={!!errors.room_type_id}>
                        <SelectValue placeholder="Select type…" />
                    </SelectTrigger>
                    <SelectContent>
                        {roomTypes.map((rt) => (
                            <SelectItem key={rt.id} value={String(rt.id)}>
                                {rt.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.room_type_id && <p className="text-destructive text-xs">{errors.room_type_id}</p>}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="status">Status</Label>
                <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                    <SelectTrigger id="status" className="w-full" aria-invalid={!!errors.status}>
                        <SelectValue placeholder="Select status…" />
                    </SelectTrigger>
                    <SelectContent>
                        {ROOM_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.status && <p className="text-destructive text-xs">{errors.status}</p>}
            </div>
        </div>
    );
}

export default function RoomPage({ rooms, roomTypes }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Room | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);

    const createForm = useForm({ room_number: '', room_type_id: '', status: '' });
    const editForm = useForm({ room_number: '', room_type_id: '', status: '' });

    function openEdit(room: Room) {
        editForm.setData({
            room_number: room.room_number,
            room_type_id: String(room.room_type_id),
            status: room.status,
        });
        setEditTarget(room);
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
            <Head title="Rooms" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Rooms</h1>
                    <Button size="sm" onClick={() => setCreateOpen(true)}>
                        Add Room
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full text-sm">
                        <thead className="border-b border-sidebar-border/70 bg-muted/50 dark:border-sidebar-border">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">#</th>
                                <th className="px-4 py-3 text-left font-medium">Room Number</th>
                                <th className="px-4 py-3 text-left font-medium">Room Type</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room) => (
                                <tr
                                    key={room.id}
                                    className="border-b border-sidebar-border/40 last:border-0 dark:border-sidebar-border/40"
                                >
                                    <td className="px-4 py-3 text-muted-foreground">{room.id}</td>
                                    <td className="px-4 py-3 font-medium">{room.room_number}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {room.room_type.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge className={statusStyles[room.status] ?? ''}>
                                            {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => openEdit(room)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => setDeleteTarget(room)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {rooms.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No rooms found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Room</DialogTitle>
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
                        <RoomForm
                            data={createForm.data}
                            setData={createForm.setData}
                            errors={createForm.errors}
                            roomTypes={roomTypes}
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
                        <DialogTitle>Edit Room</DialogTitle>
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
                        <RoomForm
                            data={editForm.data}
                            setData={editForm.setData}
                            errors={editForm.errors}
                            roomTypes={roomTypes}
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
                        <DialogTitle>Delete Room</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete room{' '}
                        <strong>{deleteTarget?.room_number}</strong>? This action cannot be undone.
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

RoomPage.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'Rooms', href: index.url() },
    ],
};

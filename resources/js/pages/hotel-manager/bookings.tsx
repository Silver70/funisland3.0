import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { cancel, store, update } from '@/actions/App/Http/Controllers/Hotel/HotelBookingController';
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
import { index } from '@/routes/hotel-manager/bookings';
import { dashboard } from '@/routes/hotel-manager';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Room {
    id: number;
    room_number: string;
}

interface HotelBooking {
    id: number;
    booking_reference: string;
    check_in: string;
    check_out: string;
    guests: number;
    status: string;
    user_id: number;
    room_id: number;
    user: User;
    room: Room;
}

interface Props {
    bookings: HotelBooking[];
    rooms: Room[];
    users: User[];
}

const BOOKING_STATUSES = ['confirmed', 'pending', 'cancelled'] as const;

const statusStyles: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
    cancelled: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400',
};

function BookingForm({
    data,
    setData,
    errors,
    rooms,
    users,
}: {
    data: {
        user_id: string;
        room_id: string;
        check_in: string;
        check_out: string;
        guests: number;
        status: string;
    };
    setData: (key: string, value: string | number) => void;
    errors: Partial<Record<string, string>>;
    rooms: Room[];
    users: User[];
}) {
    return (
        <div className="grid gap-4">
            <div className="grid gap-1.5">
                <Label htmlFor="user_id">Guest</Label>
                <Select value={data.user_id} onValueChange={(v) => setData('user_id', v)}>
                    <SelectTrigger id="user_id" className="w-full" aria-invalid={!!errors.user_id}>
                        <SelectValue placeholder="Select guest…" />
                    </SelectTrigger>
                    <SelectContent>
                        {users.map((u) => (
                            <SelectItem key={u.id} value={String(u.id)}>
                                {u.name} — {u.email}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.user_id && <p className="text-destructive text-xs">{errors.user_id}</p>}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="room_id">Room</Label>
                <Select value={data.room_id} onValueChange={(v) => setData('room_id', v)}>
                    <SelectTrigger id="room_id" className="w-full" aria-invalid={!!errors.room_id}>
                        <SelectValue placeholder="Select room…" />
                    </SelectTrigger>
                    <SelectContent>
                        {rooms.map((r) => (
                            <SelectItem key={r.id} value={String(r.id)}>
                                Room {r.room_number}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.room_id && <p className="text-destructive text-xs">{errors.room_id}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="check_in">Check In</Label>
                    <Input
                        id="check_in"
                        type="date"
                        value={data.check_in}
                        onChange={(e) => setData('check_in', e.target.value)}
                        aria-invalid={!!errors.check_in}
                    />
                    {errors.check_in && <p className="text-destructive text-xs">{errors.check_in}</p>}
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="check_out">Check Out</Label>
                    <Input
                        id="check_out"
                        type="date"
                        value={data.check_out}
                        onChange={(e) => setData('check_out', e.target.value)}
                        aria-invalid={!!errors.check_out}
                    />
                    {errors.check_out && <p className="text-destructive text-xs">{errors.check_out}</p>}
                </div>
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="guests">Guests</Label>
                <Input
                    id="guests"
                    type="number"
                    min="1"
                    value={data.guests}
                    onChange={(e) => setData('guests', parseInt(e.target.value) || 1)}
                    aria-invalid={!!errors.guests}
                />
                {errors.guests && <p className="text-destructive text-xs">{errors.guests}</p>}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="status">Status</Label>
                <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                    <SelectTrigger id="status" className="w-full" aria-invalid={!!errors.status}>
                        <SelectValue placeholder="Select status…" />
                    </SelectTrigger>
                    <SelectContent>
                        {BOOKING_STATUSES.map((s) => (
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

export default function BookingsPage({ bookings, rooms, users }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<HotelBooking | null>(null);
    const [cancelTarget, setCancelTarget] = useState<HotelBooking | null>(null);

    const createForm = useForm({
        user_id: '',
        room_id: '',
        check_in: '',
        check_out: '',
        guests: 1,
        status: 'confirmed',
    });

    const editForm = useForm({
        user_id: '',
        room_id: '',
        check_in: '',
        check_out: '',
        guests: 1,
        status: 'confirmed',
    });

    function openEdit(booking: HotelBooking) {
        editForm.setData({
            user_id: String(booking.user_id),
            room_id: String(booking.room_id),
            check_in: booking.check_in,
            check_out: booking.check_out,
            guests: booking.guests,
            status: booking.status,
        });
        setEditTarget(booking);
    }

    function confirmCancel() {
        if (!cancelTarget) {
            return;
        }

        router.patch(cancel.url(cancelTarget), {}, {
            onSuccess: () => setCancelTarget(null),
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Bookings" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Bookings</h1>
                    <Button size="sm" onClick={() => setCreateOpen(true)}>
                        New Booking
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full text-sm">
                        <thead className="border-b border-sidebar-border/70 bg-muted/50 dark:border-sidebar-border">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Reference</th>
                                <th className="px-4 py-3 text-left font-medium">Guest</th>
                                <th className="px-4 py-3 text-left font-medium">Room</th>
                                <th className="px-4 py-3 text-left font-medium">Check In</th>
                                <th className="px-4 py-3 text-left font-medium">Check Out</th>
                                <th className="px-4 py-3 text-left font-medium">Guests</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr
                                    key={booking.id}
                                    className="border-b border-sidebar-border/40 last:border-0 dark:border-sidebar-border/40"
                                >
                                    <td className="px-4 py-3 font-mono text-xs">{booking.booking_reference}</td>
                                    <td className="px-4 py-3">{booking.user.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        Room {booking.room.room_number}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{booking.check_in}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{booking.check_out}</td>
                                    <td className="px-4 py-3">{booking.guests}</td>
                                    <td className="px-4 py-3">
                                        <Badge className={statusStyles[booking.status] ?? ''}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => openEdit(booking)}
                                            >
                                                Edit
                                            </Button>
                                            {booking.status !== 'cancelled' && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => setCancelTarget(booking)}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No bookings found.
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
                        <DialogTitle>New Booking</DialogTitle>
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
                        <BookingForm
                            data={createForm.data}
                            setData={createForm.setData}
                            errors={createForm.errors}
                            rooms={rooms}
                            users={users}
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
                        <DialogTitle>Edit Booking</DialogTitle>
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
                        <BookingForm
                            data={editForm.data}
                            setData={editForm.setData}
                            errors={editForm.errors}
                            rooms={rooms}
                            users={users}
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

            {/* Cancel Confirmation Dialog */}
            <Dialog open={!!cancelTarget} onOpenChange={(open) => !open && setCancelTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Booking</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to cancel booking{' '}
                        <strong>{cancelTarget?.booking_reference}</strong>? This cannot be undone.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCancelTarget(null)}>
                            Back
                        </Button>
                        <Button variant="destructive" onClick={confirmCancel}>
                            Cancel Booking
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

BookingsPage.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'Bookings', href: index.url() },
    ],
};

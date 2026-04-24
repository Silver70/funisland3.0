<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Models\HotelBooking;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class HotelBookingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('hotel-manager/bookings', [
            'bookings' => HotelBooking::with(['user', 'room'])->get(),
            'rooms' => Room::all(['id', 'room_number']),
            'users' => User::all(['id', 'name', 'email']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'room_id' => ['required', 'integer', 'exists:rooms,id'],
            'check_in' => ['required', 'date'],
            'check_out' => ['required', 'date', 'after:check_in'],
            'guests' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'string', Rule::in(['confirmed', 'pending', 'cancelled'])],
        ]);

        do {
            $reference = 'HB-'.strtoupper(Str::random(8));
        } while (HotelBooking::where('booking_reference', $reference)->exists());

        HotelBooking::create([...$validated, 'booking_reference' => $reference]);

        return back();
    }

    public function update(Request $request, HotelBooking $hotelBooking): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'room_id' => ['required', 'integer', 'exists:rooms,id'],
            'check_in' => ['required', 'date'],
            'check_out' => ['required', 'date', 'after:check_in'],
            'guests' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'string', Rule::in(['confirmed', 'pending', 'cancelled'])],
        ]);

        $hotelBooking->update($validated);

        return back();
    }

    public function cancel(HotelBooking $hotelBooking): RedirectResponse
    {
        $hotelBooking->update(['status' => 'cancelled']);

        return back();
    }
}

<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('hotel-manager/room', [
            'rooms' => Room::with('roomType')->get(),
            'roomTypes' => RoomType::all(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'room_number' => ['required', 'string', 'max:20', 'unique:rooms,room_number'],
            'room_type_id' => ['required', 'integer', 'exists:room_types,id'],
            'status' => ['required', 'string', Rule::in(['available', 'occupied', 'maintenance'])],
        ]);

        Room::create($validated);

        return back();
    }

    public function update(Request $request, Room $room): RedirectResponse
    {
        $validated = $request->validate([
            'room_number' => ['required', 'string', 'max:20', Rule::unique('rooms', 'room_number')->ignore($room->id)],
            'room_type_id' => ['required', 'integer', 'exists:room_types,id'],
            'status' => ['required', 'string', Rule::in(['available', 'occupied', 'maintenance'])],
        ]);

        $room->update($validated);

        return back();
    }

    public function destroy(Room $room): RedirectResponse
    {
        $room->delete();

        return back();
    }
}

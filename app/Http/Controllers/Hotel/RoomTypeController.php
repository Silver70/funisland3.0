<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Models\RoomType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoomTypeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('hotel-manager/roomtype', [
            'roomtype' => RoomType::all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'base_price_per_night' => ['required', 'numeric', 'min:0'],
            'max_occupancy' => ['required', 'integer', 'min:1', 'max:20'],
        ]);

        RoomType::create($validated);

        return back();
    }

    public function update(Request $request, RoomType $roomType): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'base_price_per_night' => ['required', 'numeric', 'min:0'],
            'max_occupancy' => ['required', 'integer', 'min:1', 'max:20'],
        ]);

        $roomType->update($validated);

        return back();
    }

    public function destroy(RoomType $roomType): RedirectResponse
    {
        $roomType->delete();

        return back();
    }
}

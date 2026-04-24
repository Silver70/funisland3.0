<?php

namespace Database\Seeders;

use App\Models\HotelBooking;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;

class HotelBookingSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = Room::all();
        $users = User::all();

        HotelBooking::factory(50)->recycle($rooms)->recycle($users)->create();
    }
}

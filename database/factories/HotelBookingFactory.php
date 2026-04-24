<?php

namespace Database\Factories;

use App\Models\HotelBooking;
use App\Models\Room;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HotelBooking>
 */
class HotelBookingFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $checkIn = fake()->dateTimeBetween('now', '+6 months');
        $checkOut = Carbon::instance($checkIn)->addDays(fake()->numberBetween(1, 14));

        return [
            'booking_reference' => 'HB-'.strtoupper(fake()->unique()->bothify('??####')),
            'user_id' => User::factory(),
            'room_id' => Room::factory(),
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'guests' => fake()->numberBetween(1, 4),
            'status' => fake()->randomElement(['confirmed', 'pending', 'cancelled']),
        ];
    }

    public function confirmed(): static
    {
        return $this->state(['status' => 'confirmed']);
    }

    public function pending(): static
    {
        return $this->state(['status' => 'pending']);
    }

    public function cancelled(): static
    {
        return $this->state(['status' => 'cancelled']);
    }
}

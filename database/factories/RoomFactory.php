<?php

namespace Database\Factories;

use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Room>
 */
class RoomFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'room_type_id' => RoomType::factory(),
            'room_number' => fake()->unique()->numerify('###'),
            'status' => fake()->randomElement(['available', 'occupied', 'maintenance']),
        ];
    }

    public function available(): static
    {
        return $this->state(['status' => 'available']);
    }

    public function occupied(): static
    {
        return $this->state(['status' => 'occupied']);
    }

    public function underMaintenance(): static
    {
        return $this->state(['status' => 'maintenance']);
    }
}

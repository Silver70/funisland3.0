<?php

namespace Database\Factories;

use App\Models\RoomType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RoomType>
 */
class RoomTypeFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->randomElement([
                'Standard', 'Deluxe', 'Suite', 'Family', 'Executive', 'Budget', 'Junior Suite', 'Penthouse',
            ]),
            'description' => fake()->optional(0.8)->paragraph(),
            'base_price_per_night' => fake()->randomFloat(2, 40, 600),
            'max_occupancy' => fake()->numberBetween(1, 4),
        ];
    }
}

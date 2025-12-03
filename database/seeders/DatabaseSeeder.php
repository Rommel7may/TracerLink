<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash; // ← ADD THIS

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a single admin user
        User::create([
        'name' => 'admin',
        'email' => '2022307038@pampangastate.edu.ph',
        'password' => Hash::make('password'),
    ]);

    }
}

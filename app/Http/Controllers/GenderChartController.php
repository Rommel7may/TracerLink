<?php

namespace App\Http\Controllers;

use App\Models\Alumni;

class GenderChartController extends Controller
{
    public function genderData()
    {
        $data = Alumni::selectRaw('sex, COUNT(*) as total')
            ->groupBy('sex')
            ->get()
            ->map(function ($item) {
                $sex = $this->normalizeSex($item->sex);

                return [
                    'sex' => $sex,
                    'total' => $item->total,
                    'fill' => $this->getColor($sex),
                ];
            });

        return response()->json($data);
    }

    private function normalizeSex(?string $sex): string
    {
        if (!$sex) return 'unknown';

        $s = strtolower($sex);
        if ($s === 'm' || $s === 'male') return 'male';
        if ($s === 'f' || $s === 'female') return 'female';

        return 'unknown';
    }

    private function getColor(string $sex): string
    {
        return match ($sex) {
            'male' => 'var(--chart-1)',
            'female' => 'var(--chart-2)',
            default => 'var(--chart-3)',
        };
    }
}

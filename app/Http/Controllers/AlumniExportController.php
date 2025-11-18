<?php

namespace App\Http\Controllers;

use App\Services\AlumniExportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AlumniExportController extends Controller
{
    /**
     * Export selected or all alumni to Excel
     */
    public function export(Request $request, AlumniExportService $exportService)
    {
        try {
            $selectedIds = $request->input('selectedIds', []);
            $excelOutput = $exportService->export($selectedIds);

            return response($excelOutput)
                ->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                ->header('Content-Disposition', 'attachment; filename="alumni-list.xlsx"')
                ->header('Cache-Control', 'max-age=0');

        } catch (\Exception $e) {
            Log::error('Export failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Export failed',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}

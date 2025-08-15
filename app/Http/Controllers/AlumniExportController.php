<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Illuminate\Support\Facades\Log;

class AlumniExportController extends Controller
{
    public function export()
    {
        try {
            $alumni = Alumni::all();

            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('Alumni List');

            // 🎓 Headers — match these with AlumniForm.tsx
            $headers = [
                'Student Number',
                'Email',
                'Program',
                'Last Name',
                'Given Name',
                'Middle Initial',
                'Present Address',
                'Active Email',
                'Contact Number',
                'Graduation Year',
                'Employment Status',
                'Further Studies',
                'Sector',
                'Work Location',
                'Employer Classification',
                'Consent Given',
            ];

            $sheet->fromArray($headers, null, 'A1');

            // 📋 Populate Rows
            $rowIndex = 2;
            foreach ($alumni as $a) {
                $sheet->fromArray([
                    $a->student_number,
                    $a->email,
                    $a->program,
                    $a->last_name,
                    $a->given_name,
                    $a->middle_initial,
                    $a->present_address,
                    $a->active_email,
                    $a->contact_number,
                    $a->graduation_year,
                    $a->employment_status,
                    $a->further_studies,
                    $a->sector,
                    $a->work_location,
                    $a->employer_classification,
                    $a->consent ? 'Yes' : 'No',
                ], null, 'A' . $rowIndex++);
            }

            // ✨ Header styling
            $sheet->getStyle('A1:P1')->applyFromArray([
                'font' => ['bold' => true],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'D9E1F2'],
                ],
                'borders' => [
                    'allBorders' => ['borderStyle' => Border::BORDER_THIN],
                ],
            ]);

            // 🔄 Auto-size columns
            foreach (range('A', 'P') as $col) {
                $sheet->getColumnDimension($col)->setAutoSize(true);
            }

            // 📏 Apply border to all cells
            $lastRow = $rowIndex - 1;
            $sheet->getStyle("A1:P$lastRow")->applyFromArray([
                'borders' => [
                    'allBorders' => ['borderStyle' => Border::BORDER_THIN],
                ],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            ]);

            // 🧾 Generate Excel file in memory
            $writer = new Xlsx($spreadsheet);
            $fileName = 'alumni-list.xlsx';

            ob_start();
            $writer->save('php://output');
            $excelOutput = ob_get_clean();

            return response($excelOutput)
                ->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"')
                ->header('Cache-Control', 'max-age=0');

        } catch (\Exception $e) {
            Log::error('Export failed ❌', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Export failed ❌',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}

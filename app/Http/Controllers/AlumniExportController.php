<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AlumniExportController extends Controller
{
    /**
     * Export selected or all alumni to Excel
     */
    public function export(Request $request)
    {
        try {
            $selectedIds = $request->input('selectedIds', []);

            // ✅ Query alumni
            $query = Alumni::with('program');
            if (!empty($selectedIds)) {
                $query->whereIn('id', $selectedIds);
            }
            $alumni = $query->get();

            if ($alumni->isEmpty()) {
                return response()->json(['message' => 'No alumni found for export.'], 400);
            }

            // 📊 Create spreadsheet
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('Alumni List');

            // 🎓 Headers
            $headers = [
                'Student Number',
                'Email',
                'Program',
                'Last Name',
                'Given Name',
                'Middle Initial',
                'Sex',
                'Present Address',
                'Contact Number',
                'Graduation Year',
                'Employment Status',
                'Company Name',
                'Further Studies',
                'Sector',
                'Work Location',
                'Employer Classification',
                'Related To Course',
                'Consent Given',
                'Instruction Rating',
            ];

            // Insert 2 rows for University Heading
            $sheet->insertNewRowBefore(1, 2);

            $lastCol = chr(64 + count($headers)); // e.g., S
            $sheet->mergeCells("A1:{$lastCol}1");
            $sheet->mergeCells("A2:{$lastCol}2");

            // Set University heading
            $sheet->setCellValue('A1', 'Pampanga State University');
            $sheet->setCellValue('A2', 'Lubao, Campus');

            // Style heading
            $sheet->getStyle("A1:A2")->applyFromArray([
                'font' => [
                    'name' => 'Times New Roman',
                    'size' => 14,
                    'bold' => true,
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical'   => Alignment::VERTICAL_CENTER,
                ],
            ]);

            // Place headers in row 3
            $sheet->fromArray($headers, null, 'A3');

            // Style header row
            $sheet->getStyle("A3:{$lastCol}3")->applyFromArray([
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

            // 📋 Populate Data starting at row 4
            $rowIndex = 4;
            foreach ($alumni as $a) {
                $sheet->fromArray([[
                    $a->student_number,
                    $a->email,
                    $a->program ? $a->program->name : null,
                    $a->last_name,
                    $a->given_name,
                    $a->middle_initial,
                    $a->sex,
                    $a->present_address,
                    $a->contact_number,
                    $a->graduation_year,
                    $a->employment_status,
                    $a->company_name,
                    $a->further_studies,
                    $a->sector,
                    $a->work_location,
                    $a->employer_classification,
                    $a->related_to_course,
                    $a->consent ? 'Yes' : 'No',
                    $a->instruction_rating,
                ]], null, 'A' . $rowIndex++);
            }

            // 🔄 Auto-size columns
            foreach (range('A', $lastCol) as $col) {
                $sheet->getColumnDimension($col)->setAutoSize(true);
            }

            // 📏 Borders for all content (headers + data)
            $lastRow = $rowIndex - 1;
            $sheet->getStyle("A3:{$lastCol}{$lastRow}")->applyFromArray([
                'borders' => [
                    'allBorders' => ['borderStyle' => Border::BORDER_THIN],
                ],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            ]);

            // 🧾 Generate Excel file
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

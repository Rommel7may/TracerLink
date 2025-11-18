<?php

namespace App\Services;

use App\Models\Alumni;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Illuminate\Support\Facades\Log;

class AlumniExportService
{
    protected const HEADERS = [
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
    ];

    protected const UNIVERSITY_NAME = 'Pampanga State University';
    protected const CAMPUS_NAME = 'Lubao, Campus';
    protected const HEADER_BG_COLOR = 'D9E1F2';

    /**
     * Export alumni to Excel spreadsheet
     */
    public function export(array $selectedIds = []): string
    {
        try {
            $alumni = $this->queryAlumni($selectedIds);

            if ($alumni->isEmpty()) {
                throw new \Exception('No alumni found for export.');
            }

            $spreadsheet = $this->createSpreadsheet($alumni);
            return $this->saveSpreadsheet($spreadsheet);
        } catch (\Exception $e) {
            Log::error('Alumni export failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Query alumni with optional filtering
     */
    protected function queryAlumni(array $selectedIds): \Illuminate\Database\Eloquent\Collection
    {
        $query = Alumni::with('program');
        
        if (!empty($selectedIds)) {
            $query->whereIn('id', $selectedIds);
        }
        
        return $query->get();
    }

    /**
     * Create formatted spreadsheet
     */
    protected function createSpreadsheet($alumni): Spreadsheet
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Alumni List');

        $this->addUniversityHeading($sheet);
        $this->addHeaders($sheet);
        $this->addData($sheet, $alumni);
        $this->formatSpreadsheet($sheet);

        return $spreadsheet;
    }

    /**
     * Add university heading rows
     */
    protected function addUniversityHeading($sheet): void
    {
        $sheet->insertNewRowBefore(1, 2);
        
        $lastCol = chr(64 + count(self::HEADERS));
        $sheet->mergeCells("A1:{$lastCol}1");
        $sheet->mergeCells("A2:{$lastCol}2");

        $sheet->setCellValue('A1', self::UNIVERSITY_NAME);
        $sheet->setCellValue('A2', self::CAMPUS_NAME);

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
    }

    /**
     * Add header row
     */
    protected function addHeaders($sheet): void
    {
        $sheet->fromArray([self::HEADERS], null, 'A3');
        
        $lastCol = chr(64 + count(self::HEADERS));
        $sheet->getStyle("A3:{$lastCol}3")->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => self::HEADER_BG_COLOR],
            ],
            'borders' => [
                'allBorders' => ['borderStyle' => Border::BORDER_THIN],
            ],
        ]);
    }

    /**
     * Add alumni data rows
     */
    protected function addData($sheet, $alumni): void
    {
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
            ]], null, 'A' . $rowIndex++);
        }
    }

    /**
     * Format spreadsheet styling and sizing
     */
    protected function formatSpreadsheet($sheet): void
    {
        $lastCol = chr(64 + count(self::HEADERS));
        
        // Auto-size columns
        foreach (range('A', $lastCol) as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Add borders to all content
        $lastRow = $sheet->getHighestRow();
        $sheet->getStyle("A3:{$lastCol}{$lastRow}")->applyFromArray([
            'borders' => [
                'allBorders' => ['borderStyle' => Border::BORDER_THIN],
            ],
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
        ]);
    }

    /**
     * Save spreadsheet to file and return as download
     */
    protected function saveSpreadsheet($spreadsheet): string
    {
        $writer = new Xlsx($spreadsheet);
        ob_start();
        $writer->save('php://output');
        return ob_get_clean();
    }
}

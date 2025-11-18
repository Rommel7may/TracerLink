<?php

namespace App\Exports;

use App\Services\AlumniImportService;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class AlumniTemplateExport implements FromArray, WithEvents
{
    public function array(): array
    {
        return [
            AlumniImportService::getHeaders(),
            // Sample data row
            [
                // '1234567890',
                // 'sample@email.com',
                // 'BS INFORMATION TECHNOLOGY',
                // 'Dela Cruz',
                // 'Juan',
                // 'M',
                // 'Male',
                // 'Lubao, Pampanga',
                // '09171234567',
                // '2023',
                // 'Employed',
                // 'Sample Company (for employed)',
                // 'No',
                // 'Info',
                // 'Lubao, Pampanga',
                // 'Private',
                // 'Yes',
                // 'Yes',
                // '5',
            ],
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                // Insert 2 rows at the top for university heading
                $sheet->insertNewRowBefore(1, 2);

                $lastCol = 'S'; // 19 columns (A-S)
                $sheet->mergeCells("A1:{$lastCol}1");
                $sheet->mergeCells("A2:{$lastCol}2");

                // Set heading text
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

                // Style header row with fill color
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

                // Set custom column widths
                $columnWidths = [
                    'A' => 15,  // Student Number
                    'B' => 35,  // Email
                    'C' => 30,  // Program
                    'D' => 15,  // Last Name
                    'E' => 15,  // Given Name
                    'F' => 8,   // Middle Initial
                    'G' => 10,  // Sex
                    'H' => 35,  // Present Address
                    'I' => 15,  // Contact Number
                    'J' => 12,  // Graduation Year
                    'K' => 18,  // Employment Status
                    'L' => 22,  // Company Name
                    'M' => 18,  // Further Studies
                    'N' => 18,  // Sector
                    'O' => 28,  // Work Location
                    'P' => 22,  // Employer Classification
                    'Q' => 16,  // Related To Course
                    'R' => 14,  // Consent Given
                    'S' => 16,  // Instruction Rating
                ];

                foreach ($columnWidths as $column => $width) {
                    $sheet->getColumnDimension($column)->setWidth($width);
                }
            },
        ];
    }
}
<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class AlumniTemplateExport implements FromArray, WithEvents
{
    public function array(): array
    {
        return [[
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
        ]];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                // Insert 2 rows at the top for the heading
                $sheet->insertNewRowBefore(1, 2);

                // Merge the top row across all columns (A to S for 19 headers)
                $sheet->mergeCells('A1:S1');
                $sheet->mergeCells('A2:S2');

                // Set the heading text
                $sheet->setCellValue('A1', 'Pampanga State University');
                $sheet->setCellValue('A2', 'Lubao, Campus');

                // Style heading
                $sheet->getStyle('A1:A2')->applyFromArray([
                    'font' => [
                        'name' => 'Times New Roman',
                        'size' => 14,
                        'bold' => true,
                    ],
                    'alignment' => [
                        'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                        'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                    ],
                ]);

                // Set custom column widths based on data requirements
                $columnWidths = [
                    'A' => 15,  // Student Number - typically 8-12 characters
                    'B' => 30,  // Email - longer email addresses
                    'C' => 25,  // Program - academic program names can be lengthy
                    'D' => 15,  // Last Name
                    'E' => 15,  // Given Name
                    'F' => 8,   // Middle Initial - single character
                    'G' => 8,   // Sex - M/F or Male/Female
                    'H' => 40,  // Present Address - addresses can be very long
                    'I' => 15,  // Contact Number - phone numbers
                    'J' => 12,  // Graduation Year - 4-digit year
                    'K' => 18,  // Employment Status - employed/unemployed/etc.
                    'L' => 25,  // Company Name - company names vary in length
                    'M' => 20,  // Further Studies - yes/no or details
                    'N' => 20,  // Sector - industry sectors
                    'O' => 30,  // Work Location - could be full addresses
                    'P' => 22,  // Employer Classification - government/private/etc.
                    'Q' => 18,  // Related To Course - yes/no
                    'R' => 15,  // Consent Given - yes/no
                    'S' => 18,  // Instruction Rating - may include ratings 1-5 or text
                ];

                foreach ($columnWidths as $column => $width) {
                    $sheet->getColumnDimension($column)->setWidth($width);
                }

                // Apply solid border to all cells with content (header row A3:S3 in template)
                $highestRow = $sheet->getHighestRow();      // last row with data
                $highestCol = $sheet->getHighestColumn();   // last col with data
                $range = "A3:{$highestCol}{$highestRow}";

                $sheet->getStyle($range)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                            'color' => ['argb' => '000000'],
                        ],
                    ],
                    'font' => [
                        'bold' => true,
                    ],
                    'alignment' => [
                        'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                        'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                        'wrapText' => true,
                    ],
                ]);

                // Set row height for better visibility
                $sheet->getRowDimension(3)->setRowHeight(25);
                
                // Enable text wrapping for address and other long fields
                $sheet->getStyle('H3:H' . $highestRow)->getAlignment()->setWrapText(true);
                $sheet->getStyle('O3:O' . $highestRow)->getAlignment()->setWrapText(true);
                $sheet->getStyle('L3:L' . $highestRow)->getAlignment()->setWrapText(true);
            },
        ];
    }
}
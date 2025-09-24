<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class StudentTemplateExport implements FromArray, WithHeadings, WithEvents
{
    public function array(): array
    {
        return [
            ['', '', '', ''], // Row 1 reserved for University title
            ['', '', '', ''], // Row 2 reserved for Campus title
            [
                'Student Number' => '',
                'Student Name' => '',
                'Email' => '',
                'Year' => '',
            ], // Row 3: Column headers
        ];
    }

    public function headings(): array
    {
        return [
            ['Pampanga State University'], // Title row
            ['Lubao Campus'],              // Campus row
            ['Student Number', 'Student Name', 'Email', 'Year Graduated'], // Column headers
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                // Merge and style University title
                $sheet->mergeCells('A1:D1');
                $sheet->getStyle('A1')->getFont()->setBold(true)->setName('Times New Roman')->setSize(16);
                $sheet->getStyle('A1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);

                // Merge and style Campus title
                $sheet->mergeCells('A2:D2');
                $sheet->getStyle('A2')->getFont()->setBold(true)->setName('Times New Roman')->setSize(14);
                $sheet->getStyle('A2')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);

                // Style headers
                $sheet->getStyle('A3:D3')->getFont()->setBold(true)->setName('Times New Roman');
                $sheet->getStyle('A3:D3')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);

                // Solid thin borders for all cells
                $highestRow = $sheet->getHighestRow();
                $highestColumn = $sheet->getHighestColumn();
                $sheet->getStyle("A1:{$highestColumn}{$highestRow}")
                      ->getBorders()
                      ->getAllBorders()
                      ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

                // Wide columns
                $sheet->getColumnDimension('A')->setWidth(20);
                $sheet->getColumnDimension('B')->setWidth(30);
                $sheet->getColumnDimension('C')->setWidth(30);
                $sheet->getColumnDimension('D')->setWidth(30);
            },
        ];
    }
}

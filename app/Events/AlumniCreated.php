<?php

namespace App\Events;

use App\Models\Alumni;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow; // immediate broadcast
use Illuminate\Queue\SerializesModels;

class AlumniCreated implements ShouldBroadcastNow
{
    use SerializesModels;

    public function __construct(public Alumni $alumni) {}

    public function broadcastOn(): Channel
    {
        return new Channel('alumni'); // public channel
    }

    public function broadcastAs(): string
    {
        return 'AlumniCreated';
    }

    public function broadcastWith(): array
    {
        // only send what you need
        return [
            'id' => $this->alumni->id,
            'student_number' => $this->alumni->student_number,
            'email' => $this->alumni->email,
            'program_id' => $this->alumni->program_id,
            'last_name' => $this->alumni->last_name,
            'given_name' => $this->alumni->given_name,
            'middle_initial' => $this->alumni->middle_initial,
            'present_address' => $this->alumni->present_address,
            // 'active_email' => $this->alumni->active_email,
            'contact_number' => $this->alumni->contact_number,
            'graduation_year' => $this->alumni->graduation_year,
            'college' => $this->alumni->college,
            'sex' => $this->alumni->sex,
            'employment_status' => $this->alumni->employment_status,
            'company_name' => $this->alumni->company_name,
            'work_position' => $this->alumni->work_position,
            'further_studies' => $this->alumni->further_studies,
            'sector' => $this->alumni->sector,
            'work_location' => $this->alumni->work_location,
            'employer_classification' => $this->alumni->employer_classification,
            'related_to_course' => $this->alumni->related_to_course,
            'instruction_rating' => $this->alumni->instruction_rating,
            'consent' => $this->alumni->consent,
            'created_at' => $this->alumni->created_at?->toISOString(),
        ];
    }
}


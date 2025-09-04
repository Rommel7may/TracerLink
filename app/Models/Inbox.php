<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inbox extends Model
{
 protected $fillable = ['alumni_id', 'job_post_id', 'status'];

    public function job_post()
    {
        return $this->belongsTo(JobPost::class);
    }

    public function alumni()
    {
        return $this->belongsTo(Alumni::class);
    }
}

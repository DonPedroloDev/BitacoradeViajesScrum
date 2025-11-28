<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Activity;

class Reminders extends Model
{
    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }
}

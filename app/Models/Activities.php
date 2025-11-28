<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Trip;
use App\Models\ActivityImage;
use App\Models\Reminder;

class Activities extends Model
{
    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }

    public function images()
    {
        return $this->hasMany(ActivityImage::class);
    }

    public function reminders()
    {
        return $this->hasMany(Reminder::class);
    }
}

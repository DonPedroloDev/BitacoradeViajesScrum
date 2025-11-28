<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Activity;

class Trips extends Model
{
    //relacionar los viajes con el usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
}
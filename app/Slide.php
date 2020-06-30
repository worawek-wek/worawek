<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Slide extends Model
{
    //
    protected $fillable = [
        'slide_img_name',
        'slide_title',
        'slide_active',
    ];
    public $timestamps = true;
    protected $primaryKey = 'id';
    protected $table = 'slides';
}

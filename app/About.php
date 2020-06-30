<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class About extends Model
{
    //
    protected $fillable = [
        'about_title',
        'about_title_active',
        'about_detail',
        'about_img_name',
    ];
    public $timestamps = true;
    protected $primaryKey = 'id';
    protected $table = 'abouts';
}

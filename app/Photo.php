<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    //
    protected $fillable = [
                            'slide_img_name',
                            'slide_title'
                        ];
    protected $primaryKey = 'slide_id';
    protected $table = 'slides_tb';
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $fillable = [
        'news_title',
        'news_detail_short',
        'news_detail',
        'news_active',
        'news_img_name',
    ];
    public $timestamps = true;
    protected $primaryKey = 'id';
    protected $table = 'news';
}

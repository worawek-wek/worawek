<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'product_code',
        'product_name',
        'product_price',
        'product_weight',
        'product_img_name',
        'product_active',
        'product_detail',
    ];
    public $timestamps = true;
    protected $primaryKey = 'id';
    protected $table = 'products';
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $fillable = [
        'stock_number',
        'stock_qty',
        'product_id'
    ];
    public $timestamps = true;
    protected $primaryKey = 'id';
    protected $table = 'stocks';
}

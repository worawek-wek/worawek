<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected function resMessage($status, $message, $others=array())
    {
        return $this->setMessage($status, $message, $others);
    }

    protected function setMessage($status, $message, $others=array())
    {
        $results = array();
        if (!empty($message)) {
            $results = [
                'status' => $status,
                'message' => $message,
            ];
        }
        if(sizeof($others) > 0){
                $results = array_merge($results, $others);
        }
        return response()->json($results, $status);
    }

    protected function getNumber($code, $number)
    {
        $num = substr($number, 4);
        $last = substr($number, 0, 4);

        if($last != date("my")){
            return $code.date("my").'00001';
        }else{
            $numText = $num+1;
            $Z = '';
            for($i=strlen($numText);$i<5;$i++){
                $Z = "0".$Z;
            }
            return $code.date("my").$Z.$numText;
        }
    }
}

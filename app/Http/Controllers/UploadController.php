<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;
DB::beginTransaction();

class UploadController extends Controller
{
    //
    public function uploadImage(Request $request) // post
    {
        try{
            $path = $request->path;
            $file = $request->file('file');
            $file_name = $file->getClientOriginalName();
            $upload = $file->move('upload/'.$path, $file_name);
            if(!$upload){
                return $this->resMessage(400, 'Failed to upload image slide.');
            }
            return response(compact('file_name'), 201);
        } catch (QueryException $err) {
            DB::rollBack();
            return $this->resMessage(400, 'Failed to upload image slide.',compact('err'));
        }
    }
}

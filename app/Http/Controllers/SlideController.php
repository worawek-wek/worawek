<?php

namespace App\Http\Controllers;

use Illuminate\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use App\Slide;

DB::beginTransaction();

class SlideController extends Controller
{


    public function index(Request $request)
    {
        try {
            // return $request;
            $limit = $request->pageSize ? $request->pageSize : 10;
            $sortField = !is_null($request->sortField) ? $request->sortField : 'id';
            $sortOrder = !is_null($request->sortOrder) ? $request->sortOrder : 'desc';

            $results = Slide::selectRaw(" *,
                                        DATE_FORMAT(created_at, '%d/%m/%Y %H:%i:%s') as created,
                                        DATE_FORMAT(updated_at, '%d/%m/%Y %H:%i:%s') as updated"
                                        )
                                ->Where('slide_title','LIKE','%'.$request->slide_title.'%')
                                ->Where('slide_active','LIKE','%'.$request->slide_active.'%');
            if(!is_null($request->created_at)){
                $betweenDate = explode(',',$request->created_at);
                $results = $results->whereBetween('created_at', [$betweenDate[0], $betweenDate[1].'T23:23:59']);
            }
            $results = $results->orderBy($sortField, $sortOrder)
                                ->paginate($limit);
            $results = $results->toArray();
            $results['image_url'] = url('upload').'/';
            return $this->resMessage(200, 'Get slide successfully',$results);

        } catch (QueryException $err) {
            return $this->resMessage(400, 'Error slide',compact('err'));
        }
    }
    public function get(){
        try {
            // return $request;
            $results = Slide::selectRaw("slide_img_name as name,slide_title as title")->where('slide_active',1)->orderBy('id', 'desc')->get();
            // $results['image_url'] = url('upload').'/';
            $image_url = url('upload').'/';
            $data = $results;
            // return $results;
            return $this->resMessage(200, 'Get slide successfully',compact('data','image_url'));

        } catch (QueryException $err) {
            return $this->resMessage(400, 'Error slide',compact('err'));
        }
    }

    public function autocomplete(Request $request)
    {
        try {
            $data = Slide::selectRaw("DISTINCT slide_title")->get();
            return $this->resMessage(200, 'Get autocomplete successfully',compact('data'));

        } catch (QueryException $err) {
            return $this->resMessage(400, 'Error slide',compact('err'));
        }
    }



    public function create()
    {
        //
    }



    public function store(Request $request)
    {
        try {
            $file = $request->file('file');
            $file_name = $file->getClientOriginalName();
            $fff = $file->move('upload', $file_name);
            // return $fff;
            $slide = Slide::create([
                'slide_title' => $request->title,
                'slide_img_name' => $file_name
            ]);
            $slide->save();
            DB::commit();
            return $this->resMessage(201, 'The slide has been create successfully.');
        } catch (QueryException $err) {
            DB::rollBack();
            return $this->resMessage(400, 'Failed to create slide111.',compact('err'));
        }
    }



    public function show($id)
    {
        $results = Slide::find($id);
        return $results;
    }



    public function edit($id)
    {
            $results = Slide::find($id);
            return response(['data'=>$results],200);
    }






    public function update(Request $request, $id)
    {
        try{
            $slide = Slide::find($id);
            $slide->slide_active = $request->active;
            if($request->title){
                $slide->slide_title = $request->title;
            }
            if(!is_null($request->file_name)){
                $slide->slide_img_name = $request->file_name;
            }
            $slide->save();
            DB::commit();
            return $this->resMessage(201, 'The slide has been update successfully.');
        } catch (QueryException $err) {
            DB::rollBack();
            return $this->resMessage(400, 'Failed to update slide.',compact('err'));
        }
    }



    public function destroy($id)
    {
        try{
            $id = explode(',',$id);
            Slide::whereIn('id', $id)->delete();
            DB::commit();
        return $this->resMessage(201, 'The slide has been deleted.');
        } catch (QueryException $err) {
            DB::rollBack();
            return $this->resMessage(400, 'Failed to deleted slide.',compact('err'));
        }
    }
    // try{
    //     DB::commit();
    // } catch (QueryException $err) {
    //     DB::rollBack();
    // }
}

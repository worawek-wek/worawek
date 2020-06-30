<?php

namespace App\Http\Controllers;

use App\About;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
DB::beginTransaction();

class AboutController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(){
        try{
            $data = About::selectRaw('*,
                DATE_FORMAT(created_at, "%d/%m/%Y %H:%i:%s") as created,
                DATE_FORMAT(updated_at, "%d/%m/%Y %H:%i:%s") as updated')->first();
            $image_url = url('upload').'/about/';
            DB::commit();
            return $this->resMessage(201,'The about has been get successfully.', compact('data','image_url'));
        } catch (QueryException $err) {
            DB::rollBack();
            return $this->resMessage(400, 'Failed to get about.',compact('err'));
        }
    }
    public function get(){
        try {
            // return $request;
            $data = About::selectRaw("
                                        about_img_name as name,
                                        about_title as title,
                                        about_title_active as active,
                                        about_detail as detail,
                                        about_title_float as title_float,
                                        about_img_width as img_width"
                                        )->first();
            // $results['image_url'] = url('upload').'/';
            $image_url = url('upload').'/about/';
            // return $results;
            return $this->resMessage(200, 'Get slide successfully',compact('data','image_url'));

        } catch (QueryException $err) {
            return $this->resMessage(400, 'Error slide',compact('err'));
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\About  $about
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\About  $about
     * @return \Illuminate\Http\Response
     */
    public function edit(About $about)
    {
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\About  $about
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try{
            $about = About::find($id);
            // $about->about_title = $request->about_title;
            $about->about_title = $request->about_title;
            $about->about_title_active = $request->about_title_active;
            $about->about_detail = $request->about_detail;
            $about->about_img_width = $request->about_img_width;
            $about->about_title_float = $request->about_title_float;
            if(!is_null($request->file_name)){
                $about->about_img_name = $request->file_name;
            }
            $about->save();
            DB::commit();
            return $this->resMessage(201, 'The about has been update successfully.');
        } catch (QueryException $err) {
            DB::rollBack();
            return $this->resMessage(400, 'Failed to update about.',compact('err'));
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\About  $about
     * @return \Illuminate\Http\Response
     */
    public function destroy(About $about)
    {
        //
    }
}

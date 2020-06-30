<?php

namespace App\Http\Controllers;

use App\News;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
DB::beginTransaction();

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request){
        try{
            $limit = $request->pageSize ? $request->pageSize : 10;
            $sortField = !is_null($request->sortField) ? $request->sortField : 'id';
            $sortOrder = !is_null($request->sortOrder) ? $request->sortOrder : 'desc';

            $data = News::selectRaw('*,
                DATE_FORMAT(created_at, "%d/%m/%Y %H:%i:%s") as created,
                DATE_FORMAT(updated_at, "%d/%m/%Y %H:%i:%s") as updated');

            if(!is_null($request->created_at)){
                $betweenDate = explode(',',$request->created_at);
                $data = $data->whereBetween('created_at', [$betweenDate[0], $betweenDate[1].'T23:23:59']);
            }

            $data = $data->Where('news_title','LIKE','%'.$request->news_title.'%')
                         ->Where('news_active','LIKE','%'.$request->news_active.'%')
                         ->orderBy($sortField, $sortOrder)
                         ->paginate($limit);
            $data = $data->toArray();

            $data['image_url'] = url('upload').'/news/';
            DB::commit();
            return $this->resMessage(201,'The news has been get successfully.', $data);
        } catch (QueryException $err) {
            DB::rollBack();
            return $this->resMessage(400, 'Failed to get news.',compact('err'));
        }
    }
    public function get(){
        try {
            // return $request;
            $data = About::selectRaw("
                                        news_img_name as name,
                                        news_title as title,
                                        news_title_active as active,
                                        news_detail as detail,
                                        news_title_float as title_float,
                                        news_img_width as img_width"
                                        )->first();
            // $results['image_url'] = url('upload').'/';
            $image_url = url('upload').'/news/';
            // return $results;
            return $this->resMessage(200, 'Get news successfully',compact('data','image_url'));

        } catch (QueryException $err) {
            return $this->resMessage(400, 'Error news',compact('err'));
        }
    }


    public function autocomplete(Request $request)
    {
        try {
            $data = News::selectRaw("DISTINCT news_title")->get();
            return $this->resMessage(200, 'Get autocomplete successfully',compact('data'));

        } catch (QueryException $err) {
            return $this->resMessage(400, 'Error news',compact('err'));
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
        try {
            $file = $request->file('file');
            $file_name = $file->getClientOriginalName();
            $fff = $file->move('upload/news', $file_name);
            // return $fff;
            $news = News::create([
                'news_title' => $request->news_title,
                'news_detail_short' => $request->news_detail_short,
                'news_detail' => $request->news_detail,
                'news_img_name' => $file_name
            ]);
            $news->save();
            DB::commit();
            return $this->resMessage(201, 'The news has been create successfully.');
        } catch (QueryException $err) {
            DB::rollBack();
            return $this->resMessage(400, 'Failed to create news111.',compact('err'));
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\News  $news
     * @return \Illuminate\Http\Response
     */
    public function show(News $news)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\News  $news
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        try{
            $data = News::find($id);
            $data->image_url = url('upload').'/news/';

            return response($data, 200);
        } catch (QueryException $err) {
            return $this->resMessage(400, 'Failed to get news.',compact('err'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\News  $news
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try{
            $news = News::find($id);
            $news->news_active = $request->news_active;
            if($request->news_title){
                $news->news_title = $request->news_title;
                $news->news_detail_short = $request->news_detail_short;
                $news->news_detail = $request->news_detail;
            }
            if(!is_null($request->file_name)){
                $news->news_img_name = $request->file_name;
            }
            $news->save();
            DB::commit();
            return $this->resMessage(201, 'The news has been update successfully.');
        } catch (QueryException $err) {
            DB::rollBack();
            return $this->resMessage(400, 'Failed to update news.',compact('err'));
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\News  $news
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $id = explode(',',$id);
            News::whereIn('id', $id)->delete();
            DB::commit();
        return $this->resMessage(201, 'The slide has been deleted.');
        } catch (QueryException $err) {
            DB::rollBack();
            return $this->resMessage(400, 'Failed to deleted slide.',compact('err'));
        }
        //
    }
}

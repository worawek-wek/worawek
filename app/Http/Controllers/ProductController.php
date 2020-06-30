<?php

namespace App\Http\Controllers;

use App\Product;
use App\Stock;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
DB::beginTransaction();

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try{
            $limit = $request->pageSize ? $request->pageSize : 10;
            $sortField = !is_null($request->sortField) ? $request->sortField : 'id';
            $sortOrder = !is_null($request->sortOrder) ? $request->sortOrder : 'desc';

            $data = Product::selectRaw('products.*,
                DATE_FORMAT(products.created_at, "%d/%m/%Y %H:%i:%s") as created,
                DATE_FORMAT(products.updated_at, "%d/%m/%Y %H:%i:%s") as updated,
                format(products.product_price, 2) as product_price,
                IFNULL(SUM(stocks.stock_qty), 0) as product_qty
                ')
                ->leftJoin('stocks', 'products.id', '=', 'stocks.product_id')
                ->groupBy('products.id','product_code','product_name','product_active','product_price','product_weight','product_detail','product_img_name','products.created_at','products.updated_at');

            if(!is_null($request->created_at)){
                $betweenDate = explode(',',$request->created_at);
                $data = $data->whereBetween('products.created_at', [$betweenDate[0], $betweenDate[1].'T23:23:59']);
            }

            $data = $data->Where('products.product_name','LIKE','%'.$request->product_name.'%')
                        ->Where('products.product_code','LIKE','%'.$request->product_code.'%')
                        ->Where('products.product_active','LIKE','%'.$request->product_active.'%')

                        ->orderBy('products.'.$sortField, $sortOrder)
                        ->paginate($limit);
            $data = $data->toArray();

            $data['image_url'] = url('upload').'/product/';
            DB::commit();
            return $this->resMessage(201,'The product has been get successfully.', $data);
        } catch (QueryException $err) {
            DB::rollBack();
            return $this->resMessage(400, 'Failed to get product.',compact('err'));
        }
    }
    public function addStock(Request $request, $id){
        try {
            $lastStock = Stock::latest()->first();
            $num = substr($lastStock->stock_number, 1);

            $stockNumber = 'S'.date("my").'00001';
            if($lastStock){
                $stockNumber = $this->getNumber('S',$num);
            }
            $stock = Stock::create([
                'stock_number' => $stockNumber,
                'stock_qty' => $request->stock_qty,
                'product_id' => $id
            ])->save();
            $stock_qty = Stock::where('product_id',$id)->sum('stock_qty');

            DB::commit();
            return $this->resMessage(201, 'Add stock successfully', compact('stock_qty'));

        } catch (QueryException $err) {
            DB::rollBack();
            return $this->resMessage(400, 'Error product',compact('err'));
        }
    }
    public function autocomplete(Request $request)
    {
        try {
            $data = Product::selectRaw("DISTINCT $request->feild")->get();
            return $this->resMessage(200, 'Get autocomplete successfully',compact('data'));

        } catch (QueryException $err) {
            return $this->resMessage(400, 'Error product',compact('err'));
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
            $fff = $file->move('upload/product', $file_name);
            // return $fff;
            $product = Product::create([
                'product_code' => $request->product_code,
                'product_name' => $request->product_name,
                'product_price' => $request->product_price,
                'product_weight' => $request->product_weight,
                'product_detail' => $request->product_detail,
                'product_img_name' => $file_name
            ]);
            $product->save();
            DB::commit();
            return $this->resMessage(201, 'The product has been create successfully.');
        } catch (QueryException $err) {
            DB::rollBack();
            return $this->resMessage(400, 'Failed to create product111.',compact('err'));
        }
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        try{
            $data = Product::find($id);
            $data->image_url = url('upload').'/product/';

            return response($data, 200);
        } catch (QueryException $err) {
            return $this->resMessage(400, 'Failed to get product.',compact('err'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try{
            $product = Product::find($id);
            $product->product_active = $request->product_active;
            if($request->product_code){
                $product->product_code = $request->product_code;
                $product->product_name = $request->product_name;
                $product->product_price = $request->product_price;
                $product->product_weight = $request->product_weight;
                $product->product_detail = $request->product_detail;
            }
            if(!is_null($request->file_name)){
                $product->product_img_name = $request->file_name;
            }
            $product->save();
            DB::commit();
            return $this->resMessage(201, 'The product has been update successfully.');
        } catch (QueryException $err) {
            DB::rollBack();
            return $this->resMessage(400, 'Failed to update product.',compact('err'));
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $id = explode(',',$id);
            Product::whereIn('id', $id)->delete();
            DB::commit();
        return $this->resMessage(201, 'The slide has been deleted.');
        } catch (QueryException $err) {
            DB::rollBack();
            return $this->resMessage(400, 'Failed to deleted slide.',compact('err'));
        }
    }
}

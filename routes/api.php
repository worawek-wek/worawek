<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::get('login', 'SlideController@index');

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::prefix('auth')->group(function () {
    Route::post('register', 'UserController@register');
    Route::post('login', 'UserController@authenticate');
    Route::get('open', 'DataController@open');
});
Route::get('slide/getToWeb', 'SlideController@get');
Route::get('about/getToWeb', 'AboutController@get');

Route::group(['middleware' => ['jwt.verify']], function() {
    Route::post('auth/logout', 'UserController@authenticateDelete');
    Route::get('user', 'UserController@getAuthenticatedUser');
    Route::get('closed', 'DataController@closed');

    Route::post('uploadImage', 'UploadController@uploadImage');
    Route::get('slide/autocomplete', 'SlideController@autocomplete');
    Route::get('news/autocomplete', 'NewsController@autocomplete');
    Route::get('product/autocomplete', 'ProductController@autocomplete');
    Route::put('product/addStock/{id}', 'ProductController@addStock');

    Route::resources([
        'slide' => 'SlideController',
        'about' => 'AboutController',
        'news' => 'NewsController',
        'product' => 'ProductController',
    ]);
});

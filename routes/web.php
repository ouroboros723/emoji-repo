<?php

use App\Http\Controllers\User\Auth\TwitterController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// TwitterログインURL
Route::get('login/twitter', [TwitterController::class, 'redirectToProvider']); //標準ログインにそろえて
// TwitterコールバックURL
Route::get('auth/twitter/callback', [TwitterController::class, 'handleProviderCallback']);
// TwitterログアウトURL
Route::get('auth/twitter/logout', [TwitterController::class, 'logout']);

Route::get('/'.Config::get('auth.access_token'), function () {
    return view('index');
});

Route::get('/admin/'.Config::get('auth.admin_token'), function () {
    return view('admin');
});

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

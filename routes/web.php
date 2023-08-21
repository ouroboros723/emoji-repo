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

/* 利用者用ルーティング */
//// TwitterログインURL
//Route::get('login/twitter', [TwitterController::class, 'redirectToProvider']); //標準ログインにそろえて
//// TwitterコールバックURL
//Route::get('auth/twitter/callback', [TwitterController::class, 'handleProviderCallback']);
//// TwitterログアウトURL
//Route::get('auth/twitter/logout', [TwitterController::class, 'logout']);

Route::get('/', function () {
    return view('index');
});

/* 管理者用ルーティング */
Route::prefix('admin')->name('admin.')->group(function () {
    // Login Routes...
    Route::get('login', [App\Http\Controllers\Admin\Auth\LoginController::class, 'showLoginForm'])->name('login');
    Route::post('login', [App\Http\Controllers\Admin\Auth\LoginController::class, 'login']);

//    // Registration Routes...(現在コマンドからのみ登録を許可)
//    Route::get('register', [App\Http\Controllers\Admin\Auth\RegisterController::class, 'showRegistrationForm'])->name('register');
//    Route::post('register', [App\Http\Controllers\Admin\Auth\RegisterController::class, 'register']);

    Route::middleware('auth:api')->group( function () {
        // Logout Routes...
        Route::post('logout', [App\Http\Controllers\Admin\Auth\LoginController::class, 'logout'])->name('logout');
        Route::get('/', function () {
            return view('admin.index');
        });
    });
});



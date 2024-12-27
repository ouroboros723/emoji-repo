<?php

use App\Http\Controllers\User\Auth\TwitterController;
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

Route::middleware('auth:api')->group(function () {
    Route::prefix('admin')->group(static function () {
        Route::prefix('/emoji')->group(static function () {
            Route::get('/', [ App\Http\Controllers\Admin\EmojiPackController::class, 'getList']);
            Route::post('/add', [ App\Http\Controllers\Admin\EmojiPackController::class, 'addEmojiPack']);
            Route::post('/set-payed/{id}', [ App\Http\Controllers\Admin\EmojiPackController::class, 'setPayed']);
            Route::get('/{id}', [ App\Http\Controllers\Admin\EmojiPackController::class, 'showEmojiPackDetail']);
            Route::post('/{id}', [ App\Http\Controllers\Admin\EmojiPackController::class, 'editEmojiPack']);
            Route::delete('/{id}', [ App\Http\Controllers\Admin\EmojiPackController::class, 'deleteEmojiPack']);
        });
    });
});

Route::prefix('/emoji')->group(static function () {
    Route::get('/', [App\Http\Controllers\User\EmojiPackController::class, 'getList']);
    Route::post('/add', [ App\Http\Controllers\User\EmojiPackController::class, 'addEmojiPack']);
    Route::get('/check/{id}', [App\Http\Controllers\User\EmojiPackController::class, 'checkEmojiPackStatus']);
    Route::get('/{id}', [App\Http\Controllers\User\EmojiPackController::class, 'showEmojiPackDetail']);
});

<?php

use App\Http\Controllers\User\Auth\TwitterController;
use App\Http\Controllers\User\EmojiRepoController as UserParticipantController;
use App\Http\Controllers\Admin\EmojiRepoController as AdminParticipantController;
use App\Http\Middleware\CheckAccessToken;
use App\Http\Middleware\CheckAdminToken;
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
        Route::prefix('{token}/participant')->group(static function () {
            Route::get('/', [AdminParticipantController::class, 'getList']);
            Route::post('/add', [AdminParticipantController::class, 'addParticipants']);
            Route::post('/set-payed/{id}', [AdminParticipantController::class, 'setPayed']);
            Route::get('/{id}', [AdminParticipantController::class, 'showParticipants']);
            Route::post('/{id}', [AdminParticipantController::class, 'editParticipants']);
            Route::delete('/{id}', [AdminParticipantController::class, 'deleteParticipants']);
        });
    });
});

Route::middleware(CheckAccessToken::class)->group(static function () {
    Route::prefix('{token}/participant')->group(static function () {
        Route::get('/', [UserParticipantController::class, 'getList']);
        Route::get('/my-info', [UserParticipantController::class, 'getMyInfo']);
        Route::post('/add', [UserParticipantController::class, 'addParticipants']);
        Route::post('/set-payed/{id}', [UserParticipantController::class, 'setPayed']);
        Route::get('/{id}', [UserParticipantController::class, 'showParticipants']);
        Route::post('/my-info', [UserParticipantController::class, 'editMyParticipants']);
        Route::delete('/{id}', [UserParticipantController::class, 'deleteParticipants']);
    });
});

<?php

namespace App\Http\Middleware;

use App\Http\Controllers\ApiResponseTrait;
use Closure;
use Config;
use Illuminate\Http\Request;

class CheckAdminToken
{

    use ApiResponseTrait;

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->route()->parameter('token');

        if($token === Config::get('auth.admin_token')){
            return $next($request);
        }

        return $this->sendError('unauthorized', 401);

    }
}

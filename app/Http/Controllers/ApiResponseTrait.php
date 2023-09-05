<?php

namespace App\Http\Controllers;

use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Response;
use Symfony\Component\HttpFoundation\Response as HttpStatusCode;

/**
 * APIのレスポンスで使う形式を定義するtrait(杉浦くんありがとう...!)
 * Trait ApiResponse
 * @package App\Http\Controllers
 * @author KensukeSigiura
 */
trait ApiResponseTrait
{
    /**
     * @param  mixed        $result
     * @param  string       $message
     * @return JsonResponse
     */
    public function sendResponse($result, $message = '', $code = 200, bool $success = null): JsonResponse
    {
        return Response::json(
            [
                'success' => is_null($success) ? (int) $code === 200 : $success,
                'body'    => $result,
                'message' => $message,
            ],
            $code
        );
    }

    /**
     * @param  string       $message
     * @param  int          $code
     * @return JsonResponse
     */
    public function sendError($message, $code = HttpStatusCode::HTTP_NOT_FOUND): JsonResponse
    {
        return Response::json(
            [
                'success' => false,
                'message' => $message,
            ],
            $code
        );
    }

    /**
     * @param  string                $message
     * @param  int                   $code
     * @throws HttpResponseException
     * @return void
     */
    public function throwErrorResponse($message, $code = HttpStatusCode::HTTP_NOT_FOUND): void
    {
        throw new HttpResponseException(Response::json(['success' => false, 'message' => $message], $code));
    }

    /**
     * @param  string       $message
     * @return JsonResponse
     */
    public function sendSuccess($message = ''): JsonResponse
    {
        return Response::json(
            [
                'success' => true,
                'message' => $message,
            ],
            HttpStatusCode::HTTP_OK
        );
    }
}

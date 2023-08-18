<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Models\Participant;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ParticipantController extends BaseController
{

    /**
     * @return JsonResponse
     */
    public function getList(): JsonResponse
    {
        $Participants = Participant::orderByDesc('id')->get();

        return $this->sendResponse(array_key_camel($Participants->toArray()));
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function addParticipants(Request $request): JsonResponse
    {
        $Participant = new Participant();
        $Participant->fill(array_key_snake($request->toArray()));
        if($Participant->save()){
            return $this->sendSuccess();
        }
        return $this->sendError('failed_save');
    }

    /**
     * @param $token
     * @param $id
     * @return JsonResponse
     */
    public function showParticipants($token, $id): JsonResponse
    {
//        dd($request->toArray());
        return $this->sendResponse(array_key_camel(Participant::findOrFail($id)->toArray()));
    }

    /**
     * @param Request $request
     * @param $token
     * @param $id
     * @return JsonResponse
     */
    public function editParticipants(Request $request, $token, $id): JsonResponse
    {
//        dd($request->toArray());
        $Participant = Participant::findOrFail($id);
        $Participant->fill(array_key_snake($request->toArray()));
        if($Participant->save()){
            return $this->sendSuccess();
        }
        return $this->sendError('failed_save');
    }

    /**
     * @param $token
     * @param $id
     * @return JsonResponse
     */
    public function setPayed($token, $id): JsonResponse
    {
        $Participant = Participant::findOrFail($id);
        $Participant->is_payed = true;
        if($Participant->save()){
            return $this->sendSuccess();
        }
        return $this->sendError('failed_save');
    }

    /**
     * @param $token
     * @param $id
     * @return JsonResponse
     * @throws Exception
     */
    public function deleteParticipants($token, $id): JsonResponse
    {
        $Participant = Participant::findOrFail($id);
        if($Participant->delete()){
            return $this->sendSuccess();
        }
        return $this->sendError('failed_cancel');
    }
}

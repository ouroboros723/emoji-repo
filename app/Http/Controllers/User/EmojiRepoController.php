<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\BaseController;
use App\Models\EmojiPack;
use Auth;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Session;

class EmojiRepoController extends BaseController
{

    /**
     * @return JsonResponse
     */
    public function getList(): JsonResponse
    {
        $Participants = EmojiPack::orderByDesc('emoji_pack_id')->get();

        return $this->sendResponse(array_key_camel($Participants->toArray()));
    }

    /**
     * @return JsonResponse
     */
    public function getMyInfo(): JsonResponse
    {
        if(!is_null(Session::get('twitterId', null))){
            $Participants = EmojiPack::whereTwitterId(Session::get('twitterId', null))->firstOrFail();

            return $this->sendResponse(array_key_camel($Participants->toArray()));
        }

        return $this->sendSuccess('will_not_logged_in_twitter');
    }

    /**
     * @param $token
     * @param $id
     * @return JsonResponse
     */
    public function showParticipants($token, $id): JsonResponse
    {
//        dd($request->toArray());
        return $this->sendResponse(array_key_camel(EmojiPack::findOrFail($id)->toArray()));
    }

    /**
     * @param Request $request
     * @param $token
     * @return JsonResponse
     */
    public function editMyParticipants(Request $request, $token): JsonResponse
    {
        if(!is_null(Session::get('twitterId', null))){
            $Participant = EmojiPack::whereTwitterId(Session::get('twitterId', null))->firstOrFail();
            $params = array_key_snake($request->toArray());
            unset($params['is_payed'], $params['twitter_id'], $params['entry_fee'], $params['join_type'], $params['remarks']);
            $Participant->fill($params);
            if($Participant->save()){
                return $this->sendSuccess('profile_updated');
            }
        }

        return $this->sendError('failed_save');
    }
}

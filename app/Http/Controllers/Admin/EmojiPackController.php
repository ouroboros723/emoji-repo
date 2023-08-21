<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Models\EmojiPack;
use App\Models\Participant;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmojiPackController extends BaseController
{

    /**
     * @return JsonResponse
     */
    public function getList(): JsonResponse
    {
        $EmojiPack = EmojiPack::orderByDesc('emoji_pack_id')->get();

        return $this->sendResponse(array_key_camel($EmojiPack->toArray()));
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function addEmojiPack(Request $request): JsonResponse
    {
        $emojiPackUrl = file_get_contents($request->emojiPackUrl);
        try {
            $emojiPackMetaData = json_decode($emojiPackUrl, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException $e) {
            throw $e;
        }

        $EmojiPack = new EmojiPack();
        $EmojiPack->fill(array_key_snake($emojiPackMetaData));
        $EmojiPack->icon_url = $emojiPackMetaData['iconURL'];
        $EmojiPack->is_approved = true; // 管理画面からの登録はtrueで固定
        if($EmojiPack->save()){
            return $this->sendSuccess();
        }
        return $this->sendError('failed_save');
    }

    /**
     * @param $token
     * @param $id
     * @return JsonResponse
     */
    public function showEmojiPackDetail($id): JsonResponse
    {
//        dd($request->toArray());
        return $this->sendResponse(array_key_camel(EmojiPack::findOrFail($id)->toArray()));
    }

    /**
     * @param Request $request
     * @param $token
     * @param $id
     * @return JsonResponse
     */
    public function editEmojiPack(Request $request, $id): JsonResponse
    {
//        dd($request->toArray());
        $Participant = EmojiPack::findOrFail($id);
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
    public function setApproved($id): JsonResponse
    {
        $Participant = EmojiPack::findOrFail($id);
        $Participant->is_approved = true;
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
    public function deleteEmojiPack($id): JsonResponse
    {
        $Participant = EmojiPack::findOrFail($id);
        if($Participant->delete()){
            return $this->sendSuccess();
        }
        return $this->sendError('failed_cancel');
    }
}

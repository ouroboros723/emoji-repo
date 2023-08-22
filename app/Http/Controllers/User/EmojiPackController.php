<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\BaseController;
use App\Models\EmojiPack;
use Auth;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use JsonException;
use Session;

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
     * @throws JsonException
     */
    public function addEmojiPack(Request $request): JsonResponse
    {
        $sourceUrl = file_get_contents($request->sourceUrl);
        try {
            $emojiPackMetaData = json_decode($sourceUrl, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
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
     * @param $id
     * @return JsonResponse
     */
    public function showEmojiPackDetail($id): JsonResponse
    {
//        dd($request->toArray());
        return $this->sendResponse(array_key_camel(EmojiPack::findOrFail($id)->toArray()));
    }
}

<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\BaseController;
use App\Http\Requests\User\AddEmojiPackRequest;
use App\Models\EmojiPack;
use Illuminate\Http\JsonResponse;
use JsonException;

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
     * @param AddEmojiPackRequest $request
     * @return JsonResponse
     * @throws JsonException
     */
    public function addEmojiPack(AddEmojiPackRequest $request): JsonResponse
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
     * @param  $id integer 絵文字パックURL
     * @return JsonResponse
     */
    public function showEmojiPackDetail($id): JsonResponse
    {
        $EmojiPack = EmojiPack::findOrFail($id);
        $EmojiPack->emojis = json_decode(file_get_contents($EmojiPack->source_url), true, 512, JSON_THROW_ON_ERROR)['emojis'] ?? [];
        return $this->sendResponse(array_key_camel($EmojiPack->toArray()));
    }
}

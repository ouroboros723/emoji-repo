<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Models\EmojiPack;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

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
        $sourceUrl = file_get_contents($request->sourceUrl);
        try {
            $emojiPackMetaData = json_decode($sourceUrl, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException $e) {
            throw $e;
        }

        $alreadyRegisteredEmojiPack = EmojiPack::whereSourceUrl($request->sourceUrl)->first();

        if (is_null($alreadyRegisteredEmojiPack)) {
            $EmojiPack = new EmojiPack();
            $EmojiPack->fill(array_key_snake($emojiPackMetaData));
            $EmojiPack->source_url = $request->sourceUrl;
            $EmojiPack->icon_url = $emojiPackMetaData['iconURL'];
            $EmojiPack->is_approved = true; // 管理画面からの登録はtrueで固定
            if($EmojiPack->save()){
                return $this->sendSuccess();
            }
            return $this->sendError('failed_save', Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        if($alreadyRegisteredEmojiPack->version !== $emojiPackMetaData['version']) {
            $alreadyRegisteredEmojiPack->fill(array_key_snake($emojiPackMetaData));
            $alreadyRegisteredEmojiPack->source_url = $request->sourceUrl;
            $alreadyRegisteredEmojiPack->icon_url = $emojiPackMetaData['iconURL'];
            $alreadyRegisteredEmojiPack->is_approved = true; // 管理画面からの登録はtrueで固定
            if($alreadyRegisteredEmojiPack->save()){
                return $this->sendSuccess();
            }
            return $this->sendError('failed_save', Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->sendError('already_registered', Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     * @param $token
     * @param $id
     * @return JsonResponse
     */
    public function showEmojiPackDetail($id): JsonResponse
    {
        $EmojiPack = EmojiPack::findOrFail($id);
        $EmojiPack->emojis = json_decode(file_get_contents($EmojiPack->source_url), true, 512, JSON_THROW_ON_ERROR)['emojis'] ?? [];
        return $this->sendResponse(array_key_camel($EmojiPack->toArray()));
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
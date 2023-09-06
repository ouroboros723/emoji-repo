<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\BaseController;
use App\Http\Requests\User\AddEmojiPackRequest;
use App\Models\EmojiPack;
use Exception;
use Illuminate\Http\JsonResponse;
use JsonException;
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
     * 指定された絵文字パックのステータスを取得して返します。
     * @param $emojiPackId
     * @return JsonResponse
     * @throws JsonException
     */
    public function checkEmojiPackStatus($emojiPackId): JsonResponse
    {
        $EmojiPack = EmojiPack::findOrFail($emojiPackId);
        try {
            $contents = file_get_contents($EmojiPack->source_url);
        } catch (Exception $e) {
            $this->throwErrorResponse($e->getMessage(), Response::HTTP_BAD_GATEWAY);
        }
        $emojiPackMetaData = json_decode($contents, true, 512, JSON_THROW_ON_ERROR);

        $errors = [];
        $warnings = [];
        foreach($emojiPackMetaData['emojis'] ?? [] as $key => $emoji) {
            if(empty($emoji['shortcode'])) {
                $errors[$key]['emptyShortCode'] = $emoji;
            }
            preg_match('/\A[a-zA-Z0-9_]{2,}\z/', $emoji['shortcode'], $m);
            if(empty($m)) {
                $warnings[$key]['invalidShortCode'] = $emoji;
            }

            if(empty($emoji['imageURL'])) {
                $errors[$key]['emptyImageUrl'] = $emoji;
            } else if(!filter_var( $emoji['imageURL'], FILTER_VALIDATE_URL)){
                $errors[$key]['invalidImageUrl'] = $emoji;
            }
        }

        $result = [
            'errors' => $errors,
            'warnings' => $warnings,
        ];

        if(!empty($errors)) {
            return $this->sendResponse($result, 'part_of_invalid_data', Response::HTTP_OK, false);
        }
        if(!empty($warnings)) {
            return $this->sendResponse($result, 'part_of_warning_data', Response::HTTP_OK, true);
        }

        return $this->sendResponse($result, 'ok');
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

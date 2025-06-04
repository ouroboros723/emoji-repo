<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Admin\AddEmojiPackRequest;
use App\Http\Requests\Admin\EditEmojiPackRequest;
use App\Models\EmojiPack;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use JsonException;
use Symfony\Component\HttpFoundation\Response;

class EmojiPackController extends BaseController
{

    /**
     * @return JsonResponse
     */
    public function getList(): JsonResponse
    {
        $admin = Auth::guard('api')->user();

        // 全ての絵文字パックを取得し、編集可能かどうかの情報を追加
        $EmojiPacks = EmojiPack::orderByDesc('emoji_pack_id')->get();

        // 各絵文字パックに編集可能フラグを追加
        $EmojiPacksWithPermission = $EmojiPacks->map(function ($emojiPack) use ($admin) {
            $emojiPackArray = $emojiPack->toArray();
            $emojiPackArray['can_edit'] = $emojiPack->canEditBy($admin);
            return $emojiPackArray;
        });

        return $this->sendResponse(array_key_camel($EmojiPacksWithPermission->toArray()));
    }

    /**
     * @param AddEmojiPackRequest $request
     * @return JsonResponse
     * @throws JsonException
     */
    public function addEmojiPack(AddEmojiPackRequest $request): JsonResponse
    {
        $admin = Auth::guard('api')->user();
        $sourceUrl = file_get_contents($request->sourceUrl);
        $emojiPackMetaData = json_decode($sourceUrl, true, 512, JSON_THROW_ON_ERROR);

        $alreadyRegisteredEmojiPack = EmojiPack::whereSourceUrl($request->sourceUrl)->first();

        if (is_null($alreadyRegisteredEmojiPack)) {
            $EmojiPack = new EmojiPack();
            $EmojiPack->fill(array_key_snake($emojiPackMetaData));
            $EmojiPack->source_url = $request->sourceUrl;
            $EmojiPack->icon_url = $emojiPackMetaData['iconURL'];
            $EmojiPack->created_by_admin_id = $admin->id; // 作成者IDを設定
            $EmojiPack->is_approved = true; // 管理画面からの登録はtrueで固定
            if($EmojiPack->save()){
                return $this->sendSuccess();
            }
            return $this->sendError('failed_save', Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        if($alreadyRegisteredEmojiPack->version !== $emojiPackMetaData['version']) {
            // 既存の絵文字パックの編集権限をチェック
            if (!$alreadyRegisteredEmojiPack->canEditBy($admin)) {
                return $this->sendError('permission_denied', Response::HTTP_FORBIDDEN);
            }

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
     * @param  $id integer 絵文字パックID
     * @return JsonResponse
     */
    public function showEmojiPackDetail($id): JsonResponse
    {
        $admin = Auth::guard('api')->user();
        $EmojiPack = EmojiPack::findOrFail($id);
        $EmojiPack->emojis = json_decode(file_get_contents($EmojiPack->source_url), true, 512, JSON_THROW_ON_ERROR)['emojis'] ?? [];

        // 編集可能フラグを追加
        $emojiPackArray = $EmojiPack->toArray();
        $emojiPackArray['can_edit'] = $EmojiPack->canEditBy($admin);

        return $this->sendResponse(array_key_camel($emojiPackArray));
    }

    /**
     * @param EditEmojiPackRequest $request
     * @param $id integer 絵文字パックID
     * @return JsonResponse
     */
    public function editEmojiPack(EditEmojiPackRequest $request, $id): JsonResponse
    {
        $admin = Auth::guard('api')->user();
        $EmojiPack = EmojiPack::findOrFail($id);

        // 編集権限をチェック
        if (!$EmojiPack->canEditBy($admin)) {
            return $this->sendError('permission_denied', Response::HTTP_FORBIDDEN);
        }

        $EmojiPack->fill(array_key_snake($request->toArray()));
        if($EmojiPack->save()){
            return $this->sendSuccess();
        }
        return $this->sendError('failed_save');
    }

    /**
     * @param $id integer 絵文字パックID
     * @return JsonResponse
     */
    public function setApproved($id): JsonResponse
    {
        $admin = Auth::guard('api')->user();
        $EmojiPack = EmojiPack::findOrFail($id);

        // 編集権限をチェック
        if (!$EmojiPack->canEditBy($admin)) {
            return $this->sendError('permission_denied', Response::HTTP_FORBIDDEN);
        }

        $EmojiPack->is_approved = true;
        if($EmojiPack->save()){
            return $this->sendSuccess();
        }
        return $this->sendError('failed_save');
    }

    /**
     * @param $id integer 絵文字パックID
     * @return JsonResponse
     * @throws Exception
     */
    public function deleteEmojiPack($id): JsonResponse
    {
        $admin = Auth::guard('api')->user();
        $EmojiPack = EmojiPack::findOrFail($id);

        // 編集権限をチェック
        if (!$EmojiPack->canEditBy($admin)) {
            return $this->sendError('permission_denied', Response::HTTP_FORBIDDEN);
        }

        if($EmojiPack->delete()){
            return $this->sendSuccess();
        }
        return $this->sendError('failed_cancel');
    }
}

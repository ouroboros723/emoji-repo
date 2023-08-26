<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 *
 * @property string $iconUrl 絵文字パックアイコンURL
 * @property string $name 絵文字パック名
 * @property string $version 絵文字パックバージョン
 * @property string $description 絵文字パック説明
 * @property string $credit クレジット
 * @property bool $isApproved 絵文字パック公開を承認するか？
 */
class EditEmojiPackRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'iconUrl' => ['required', 'string', 'url'],
            'name' => ['required', 'string'],
            'version' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'credit' => ['nullable', 'string'],
//            'isApproved' => ['required', 'bool'], // todo: 承認機能を実装したら有効化
        ];
    }
}

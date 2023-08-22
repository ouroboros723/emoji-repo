<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\EmojiPack
 *
 * @property int $emoji_pack_id 絵文字パックID
 * @property string $icon_url 絵文字パック アイコンURL
 * @property string $name 絵文字パック名
 * @property string $version 絵文字パックバージョン
 * @property string $description 詳細
 * @property string $credit クレジット
 * @property bool $is_approved 承認状態
 * @property \Illuminate\Support\Carbon|null $created_at 登録日時
 * @property \Illuminate\Support\Carbon|null $updated_at 更新日時
 * @property \Illuminate\Support\Carbon|null $deleted_at 削除日時
 * @property string $source_url 絵文字パックURL
 * @method static \Illuminate\Database\Eloquent\Builder|EmojiPack newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|EmojiPack newQuery()
 * @method static \Illuminate\Database\Query\Builder|EmojiPack onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|EmojiPack query()
 * @method static \Illuminate\Database\Eloquent\Builder|EmojiPack whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EmojiPack whereCredit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EmojiPack whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EmojiPack whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EmojiPack whereEmojiPackId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EmojiPack whereIconUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EmojiPack whereIsApproved($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EmojiPack whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EmojiPack whereSourceUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EmojiPack whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EmojiPack whereVersion($value)
 * @method static \Illuminate\Database\Query\Builder|EmojiPack withTrashed()
 * @method static \Illuminate\Database\Query\Builder|EmojiPack withoutTrashed()
 * @mixin \Eloquent
 */
class EmojiPack extends Model
{
    use SoftDeletes;

    protected $table = "emoji_packs";
    protected $primaryKey = "emoji_pack_id";

    protected $guarded = [
        'emoji_pack_id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $casts = [
        'emoji_pack_id' => 'integer',
        'icon_url' => 'string',
        'source_url' => 'string',
        'name' => 'string',
        'version' => 'string',
        'description' => 'string',
        'credit' => 'string',
        'is_approved' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];
}

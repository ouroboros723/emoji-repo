<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Foundation\Auth\User as Authenticatable;
/**
 * App\Models\Participant
 *
 * @property int $id
 * @property string $name 参加者名(HN)
 * @property string $line_name LINE名
 * @property string $character_name 参加キャラクター名
 * @property string $twitter_id 参加者 Twitter ID
 * @property int $is_payed 支払い済み？
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $deleted_at
 * @method static \Illuminate\Database\Eloquent\Builder|Participant newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Participant newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Participant query()
 * @method static \Illuminate\Database\Eloquent\Builder|Participant whereCharacterName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Participant whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Participant whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Participant whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Participant whereIsPayed($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Participant whereLineName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Participant whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Participant whereTwitterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Participant whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Participant extends Authenticatable
{
    protected $table = 'participants';
    protected $id = 'id';

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}

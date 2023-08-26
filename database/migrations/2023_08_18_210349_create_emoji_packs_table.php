<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmojiPacksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('emoji_packs', function (Blueprint $table) {
            $table->id('emoji_pack_id')->comment('絵文字パックID');
            $table->string('icon_url', 8000)->comment('絵文字パックURL');
            $table->string('name', 255)->comment('絵文字パック名');
            $table->string('version', 255)->comment('絵文字パックバージョン');
            $table->text('description')->comment('詳細');
            $table->text('credit')->comment('クレジット');
            $table->boolean('is_approved')->comment('承認状態');
            $table->dateTime('created_at')->nullable()->comment('登録日時');
            $table->dateTime('updated_at')->nullable()->comment('更新日時');
            $table->dateTime('deleted_at')->nullable()->comment('削除日時');
        });


    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('emoji_packs');
    }
}

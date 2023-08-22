<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyEmojiPacksAddColumnSourceUrl extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('emoji_packs', function (Blueprint $table) {
            $table->text('source_url')->comment('絵文字パックURL');
            $table->text('icon_url')->comment('絵文字パック アイコンURL')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('emoji_packs', function (Blueprint $table) {
            $table->dropColumn(['source_url']);
            $table->string('icon_url', 8000)->comment('絵文字パックURL')->change();
        });
    }
}

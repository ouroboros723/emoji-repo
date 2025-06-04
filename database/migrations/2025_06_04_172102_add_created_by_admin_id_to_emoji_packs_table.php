<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCreatedByAdminIdToEmojiPacksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('emoji_packs', function (Blueprint $table) {
            $table->unsignedBigInteger('created_by_admin_id')->nullable()->after('emoji_pack_id')->comment('絵文字パック追加ユーザーid');
            $table->foreign('created_by_admin_id')->references('id')->on('admins')->onDelete('set null');
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
            $table->dropForeign(['created_by_admin_id']);
            $table->dropColumn('created_by_admin_id');
        });
    }
}

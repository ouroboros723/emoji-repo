<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyEmojiPacksSetNullableCredit extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('emoji_packs', function (Blueprint $table) {
            $table->text('description')->nullable()->comment('詳細')->change();
            $table->text('credit')->nullable()->comment('クレジット')->change();
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
            $table->text('description')->nullable(false)->comment('詳細')->change();
            $table->text('credit')->nullable(false)->comment('クレジット')->change();
        });
    }
}

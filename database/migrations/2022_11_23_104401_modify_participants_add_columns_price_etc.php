<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyParticipantsAddColumnsPriceEtc extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('participants', function (Blueprint $table) {
            $table->unsignedInteger('entry_fee')->comment('参加費');
            $table->string('join_type', 255)->comment('参加種別');
            $table->text('remarks')->nullable()->comment('備考');
            $table->string('character_name', 255)->nullable()->comment('参加キャラクター名')->change();
            $table->text('comment')->nullable()->comment('ひとこと')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('participants', function (Blueprint $table) {
            $table->dropColumn(['entry_fee', 'join_type', 'remarks']);
            $table->string('character_name', 255)->nullable(false)->comment('参加キャラクター名')->change();
            $table->text('comment')->nullable(false)->comment('ひとこと')->change();
        });
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParticipantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('participants', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255)->comment('参加者名(HN)');
            $table->string('line_name', 255)->comment('LINE名');
            $table->string('character_name', 255)->comment('参加キャラクター名');
            $table->string('twitter_id', 255)->comment('参加者 Twitter ID');
            $table->boolean('is_payed')->default(false)->comment('支払い済み？');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('participants');
    }
}

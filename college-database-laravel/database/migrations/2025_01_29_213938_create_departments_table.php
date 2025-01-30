<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', 50);
            $table->char('telephone', 10);
            $table->string('office_location', 100);
            $table->unsignedBigInteger('chairperson_id');
            $table->foreign('chairperson_id')
                  ->references('id')
                  ->on('professors')
                  ->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('departments');
    }
};

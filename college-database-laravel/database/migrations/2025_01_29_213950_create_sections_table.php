<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->integer('section_number');
            
            $table->string('classroom', 50)->nullable();
            $table->integer('number_of_seats')->nullable();
            $table->string('meeting_days', 20)->nullable();
            $table->time('beginning_time')->nullable();
            $table->time('ending_time')->nullable();
            
            $table->unsignedBigInteger('course_id');
            $table->foreign('course_id')
                  ->references('id')
                  ->on('courses')
                  ->cascadeOnDelete();

            $table->unsignedBigInteger('professor_id')->nullable();
            $table->foreign('professor_id')
                  ->references('id')
                  ->on('professors')
                  ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sections');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('section_id');

            $table->char('grade', 2)->nullable();

            $table->foreign('student_id')
                  ->references('id')
                  ->on('students')
                  ->cascadeOnDelete();

            $table->foreign('section_id')
                  ->references('id')
                  ->on('sections')
                  ->cascadeOnDelete();

            $table->unique(['student_id', 'section_id']);

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('enrollments');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->integer('course_number')->unique(); 
            $table->string('title', 100);
            $table->string('textbook', 255)->nullable();
            $table->integer('units');
            $table->unsignedBigInteger('department_id');
            $table->foreign('department_id')
                  ->references('id')
                  ->on('departments')
                  ->cascadeOnDelete(); 

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('courses');
    }
};

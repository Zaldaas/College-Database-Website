<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->char('campus_wide_id', 9)->unique();
            $table->string('first_name', 50);
            $table->string('last_name', 50);

            $table->string('street_address', 100);
            $table->string('city', 50);
            $table->char('state', 2);
            $table->char('zip_code', 5);
            $table->char('area_code', 3)->nullable();
            $table->char('number', 7)->nullable();

            $table->unsignedBigInteger('major_department_id')->nullable();
            $table->foreign('major_department_id')
                  ->references('id')
                  ->on('departments')
                  ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('students');
    }
};

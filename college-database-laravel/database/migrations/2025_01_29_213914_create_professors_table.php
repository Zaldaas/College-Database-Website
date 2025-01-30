<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('professors', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->char('social_security_number', 9)->unique();
            $table->string('name', 100);
            $table->string('street_address', 100);
            $table->string('city', 50);
            $table->char('state', 2);
            $table->char('zip_code', 5);
            $table->char('area_code', 3);
            $table->char('number', 7);
            $table->char('sex', 1);
            $table->string('title', 50);
            $table->decimal('salary', 10, 2);
            $table->string('college_degrees', 255)->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('professors');
    }
};

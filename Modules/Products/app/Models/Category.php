<?php

namespace Modules\Products\Models;

use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\Products\Database\Factories\CategoryFactory;

#[UseFactory(CategoryFactory::class)]
class Category extends Model
{
    /** @use HasFactory<CategoryFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ["name","slug","description","is_active"];
}

<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Modules\Products\Models\Category;

test('guests are redirected to the login page', function () {
    $this->get(route('categories.index'))->assertRedirect(route('login'));
});

test('authenticated users see the categories page from the products module', function () {
    $this->actingAs(User::factory()->create());
    Category::factory()->count(2)->create();

    $this->get(route('categories.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Categories/Index')
            ->has('categories', 2)
        );
});

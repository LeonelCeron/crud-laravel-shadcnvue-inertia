<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { dashboard } from '@/routes';
import { index } from '@/routes/categories';
import CategoriesDataTable from '../../components/categories/CategoriesDataTable.vue';
import type { Category } from '../../types/category';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: dashboard(),
            },
            {
                title: 'Product Category',
                href: index(),
            },
        ],
    },
});

defineProps<{
    categories: Category[];
}>();
</script>

<template>
    <Head title="Product Category" />

    <div class="flex h-full flex-1 flex-col gap-4 p-4">
        <div class="flex flex-col gap-1">
            <h2 class="text-2xl font-semibold tracking-tight">Product Category</h2>
            <p class="text-sm text-muted-foreground">
                Browse, search and sort your product categories.
            </p>
        </div>

        <CategoriesDataTable :categories="categories" />
    </div>
</template>

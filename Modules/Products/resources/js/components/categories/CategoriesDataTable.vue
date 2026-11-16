<script setup lang="ts">
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    Settings2,
} from '@lucide/vue';
import { FlexRender, useTable } from '@tanstack/vue-table';
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableEmpty,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Category } from '../../types/category';
import { categoryColumns, categoryTableFeatures } from './columns';

const props = defineProps<{
    categories: Category[];
}>();

const globalFilter = ref('');

const table = useTable({
    features: categoryTableFeatures,
    columns: categoryColumns,
    data: computed(() => props.categories),
    getRowId: (category: Category) => String(category.id),
    globalFilterFn: 'includesString',
    state: computed(() => ({ globalFilter: globalFilter.value })),
    onGlobalFilterChange: (next) => {
        globalFilter.value =
            typeof next === 'function' ? next(globalFilter.value) : next;
    },
    initialState: {
        pagination: { pageIndex: 0, pageSize: 10 },
    },
});

const hideableColumns = computed(() =>
    table.getAllColumns().filter((column) => column.getCanHide()),
);
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
            <div class="relative w-full max-w-sm">
                <Search
                    class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                    v-model="globalFilter"
                    placeholder="Search categories..."
                    class="pl-8"
                />
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button variant="outline" size="sm" class="ml-auto">
                        <Settings2 />
                        Columns
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuCheckboxItem
                            v-for="column in hideableColumns"
                            :key="column.id"
                            class="capitalize"
                            :model-value="column.getIsVisible()"
                            @update:model-value="
                                (value) => column.toggleVisibility(!!value)
                            "
                        >
                            {{ column.id.replace('_', ' ') }}
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <div class="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow
                        v-for="headerGroup in table.getHeaderGroups()"
                        :key="headerGroup.id"
                    >
                        <TableHead
                            v-for="header in headerGroup.headers"
                            :key="header.id"
                        >
                            <FlexRender
                                v-if="!header.isPlaceholder"
                                :header="header"
                            />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="table.getRowModel().rows.length">
                        <TableRow
                            v-for="row in table.getRowModel().rows"
                            :key="row.id"
                            :data-state="
                                row.getIsSelected() ? 'selected' : undefined
                            "
                        >
                            <TableCell
                                v-for="cell in row.getVisibleCells()"
                                :key="cell.id"
                            >
                                <FlexRender :cell="cell" />
                            </TableCell>
                        </TableRow>
                    </template>
                    <TableEmpty
                        v-else
                        :colspan="table.getVisibleLeafColumns().length"
                    >
                        No categories found.
                    </TableEmpty>
                </TableBody>
            </Table>
        </div>

        <div class="flex items-center justify-between gap-4">
            <p class="text-sm text-muted-foreground">
                {{ table.getFilteredSelectedRowModel().rows.length }} of
                {{ table.getFilteredRowModel().rows.length }} row(s) selected
            </p>

            <div class="flex items-center gap-2">
                <span class="text-sm text-muted-foreground">
                    Page {{ table.atoms.pagination.get().pageIndex + 1 }} of
                    {{ Math.max(table.getPageCount(), 1) }}
                </span>
                <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label="First page"
                    :disabled="!table.getCanPreviousPage()"
                    @click="table.firstPage()"
                >
                    <ChevronsLeft />
                </Button>
                <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label="Previous page"
                    :disabled="!table.getCanPreviousPage()"
                    @click="table.previousPage()"
                >
                    <ChevronLeft />
                </Button>
                <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label="Next page"
                    :disabled="!table.getCanNextPage()"
                    @click="table.nextPage()"
                >
                    <ChevronRight />
                </Button>
                <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label="Last page"
                    :disabled="!table.getCanNextPage()"
                    @click="table.lastPage()"
                >
                    <ChevronsRight />
                </Button>
            </div>
        </div>
    </div>
</template>

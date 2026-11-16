import { ArrowDown, ArrowUp, ArrowUpDown } from '@lucide/vue';
import {
    columnFilteringFeature,
    columnVisibilityFeature,
    createColumnHelper,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    filterFn_includesString,
    globalFilteringFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    sortFn_alphanumeric,
    sortFn_datetime,
    sortFn_text,
    tableFeatures,
} from '@tanstack/vue-table';
import { h } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { Category } from '../../types/category';

export const categoryTableFeatures = tableFeatures({
    columnFilteringFeature,
    globalFilteringFeature,
    rowSortingFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    columnVisibilityFeature,
    filteredRowModel: createFilteredRowModel(),
    sortedRowModel: createSortedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    filterFns: { includesString: filterFn_includesString },
    sortFns: {
        alphanumeric: sortFn_alphanumeric,
        text: sortFn_text,
        datetime: sortFn_datetime,
    },
});

type SortableColumn = {
    getIsSorted: () => false | 'asc' | 'desc';
    toggleSorting: (desc?: boolean) => void;
};

function sortableHeader(column: SortableColumn, label: string) {
    const sortDirection = column.getIsSorted();
    const icon =
        sortDirection === 'asc'
            ? ArrowUp
            : sortDirection === 'desc'
              ? ArrowDown
              : ArrowUpDown;

    return h(
        Button,
        {
            variant: 'ghost',
            size: 'sm',
            class: '-ml-3',
            onClick: () => column.toggleSorting(sortDirection === 'asc'),
        },
        () => [label, h(icon)],
    );
}

const columnHelper = createColumnHelper<
    typeof categoryTableFeatures,
    Category
>();

export const categoryColumns = columnHelper.columns([
    columnHelper.display({
        id: 'select',
        header: ({ table }) =>
            h(Checkbox, {
                modelValue: table.getIsAllPageRowsSelected()
                    ? true
                    : table.getIsSomePageRowsSelected()
                      ? 'indeterminate'
                      : false,
                'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
                    table.toggleAllPageRowsSelected(value === true),
                'aria-label': 'Select all',
            }),
        cell: ({ row }) =>
            h(Checkbox, {
                modelValue: row.getIsSelected(),
                'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
                    row.toggleSelected(value === true),
                'aria-label': 'Select row',
            }),
        enableSorting: false,
        enableHiding: false,
    }),
    columnHelper.accessor('name', {
        header: ({ column }) => sortableHeader(column, 'Name'),
        cell: ({ row }) =>
            h('span', { class: 'font-medium' }, row.original.name),
        sortFn: 'alphanumeric',
    }),
    columnHelper.accessor('slug', {
        header: ({ column }) => sortableHeader(column, 'Slug'),
        cell: ({ row }) =>
            h('span', { class: 'text-muted-foreground' }, row.original.slug),
        sortFn: 'alphanumeric',
    }),
    columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) =>
            h(
                'span',
                { class: 'block max-w-xs truncate' },
                row.original.description ?? '—',
            ),
        enableSorting: false,
    }),
    columnHelper.accessor('is_active', {
        header: 'Status',
        cell: ({ row }) =>
            h(
                Badge,
                { variant: row.original.is_active ? 'default' : 'secondary' },
                () => (row.original.is_active ? 'Active' : 'Inactive'),
            ),
    }),
    columnHelper.accessor('created_at', {
        header: ({ column }) => sortableHeader(column, 'Created'),
        cell: ({ row }) =>
            new Date(row.original.created_at).toLocaleDateString(),
        sortFn: 'datetime',
    }),
]);

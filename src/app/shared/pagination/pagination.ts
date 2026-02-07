import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-pagination',
    imports: [],
    templateUrl: './pagination.html',
    styleUrl: './pagination.css',
})
export class Pagination implements OnChanges {

    @Input() currentPage = 1;
    @Input() totalPages = 1;

    @Output() pageChange = new EventEmitter<number>();

    public pages: number[] = [1];

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['currentPage'] || changes['totalPages']) {
            this.pages = this.calculatePages();
        }
    }

    public calculatePages(): number[] {
        const visiblePages = 5; // Number of page buttons to show
        const half = Math.floor(visiblePages / 2);

        let start = Math.max(this.currentPage - half, 1);
        let end = Math.min(start + visiblePages - 1, this.totalPages);

        start = Math.max(end - visiblePages + 1, 1);

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    public goToPage(page: number) {
        if (page < 1 || page > this.totalPages) return;
        this.pageChange.emit(page);
    }
}

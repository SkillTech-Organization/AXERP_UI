import { EventEmitter } from "@angular/core"

export class IPaginationChangedEvent {
    PageIndex: number = 1
    PageSize: number = 25
}

export class SimplePaginator {
    get AllPages(): number {
        return Math.round(this.TotalCount / this.PageSize)
    }

    get CanPageBack(): boolean {
        return this.PageIndex > 1
    }

    get HasMorePages(): boolean {
        return this.PageIndex < this.AllPages
    }

    get IsLastPage(): boolean {
        return this.PageIndex === this.AllPages
    }

    get IsFirstPage(): boolean {
        return this.PageIndex < 2
    }

    get Label(): string {
        return `Total Count: ${this.TotalCount} | Page: ${this.PageIndex} \\ ${this.AllPages}`
    }

    public PaginationChanged: EventEmitter<IPaginationChangedEvent> = new EventEmitter<IPaginationChangedEvent>()

    constructor(
        public PageIndex: number = 1,
        public PageSize: number = 25,
        public TotalCount: number = 0,
    ) {

    }

    private _signal_changed(): void {
        this.PaginationChanged.emit({
            PageIndex: this.PageIndex,
            PageSize: this.PageSize
        });
    }

    pageBack(pageSize: number = 100): void {
        const pageSizeChanged = this.PageSize !== pageSize
        const oldSize = this.PageSize
        this.PageSize = pageSize
        if (this.CanPageBack) {
            this.PageIndex -= 1
            this._signal_changed()
        }
    }

    pageNext(pageSize: number = 100): void {
        const pageSizeChanged = this.PageSize !== pageSize
        const oldSize = this.PageSize
        this.PageSize = pageSize
        if (this.HasMorePages) {
            this.PageIndex += 1
            this._signal_changed()
        }
    }

    pageFirst(): void {
        if (!this.IsFirstPage) {
            this.PageIndex = 1
            this._signal_changed()
        }
    }

    pageLast(): void {
        if (!this.IsLastPage) {
            this.PageIndex = this.AllPages
            this._signal_changed()
        }
    }
}
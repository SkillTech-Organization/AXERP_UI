export class GridModel {
    public get DisplayedColumns(): string[] {
        if (this.ShowSelection) {
            return ['select'].concat(this.Columns.filter(x => x.Show).map(x => x.ColKey))
        }
        return this.Columns.filter(x => x.Show).map(x => x.ColKey)
    }

    constructor(
        public Columns: ColumnModel[],
        public ShowSelection: boolean = true
    ) {

    }
}

export class ColumnModel {
    constructor(
        public Show: boolean,
        public ColKey: string,
        public Title: string,
        public SortTooltip: string = ""
    ) {

    }
}
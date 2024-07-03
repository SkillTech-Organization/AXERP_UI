export enum ColumnTypes {
    undefined = "undefined",
    string = "string",
    number = "number",
    date = "date",
    boolean = "boolean",
    custom = "custom"
}

export enum TextAligns {
    undefined = "undefined",
    left = "left",
    right = "right",
    center = "center"
}

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
        public ColumnType: ColumnTypes = ColumnTypes.undefined,
        public SortTooltip: string = "",
        public TextAlign: TextAligns = TextAligns.left
    ) {

    }
}
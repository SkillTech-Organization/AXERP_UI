import { ColumnData } from "./ColumnData"

export enum ColumnTypes {
    undefined = "undefined",
    string = "string",
    number = "number",
    date = "date",
    boolean = "boolean",
    custom = "custom"
}

export const ColumnTypeToAgFilter = {
    "undefined": true,
    "string": 'agTextColumnFilter',
    "number": 'agNumberColumnFilter',
    "date": 'agDateColumnFilter',
    "boolean": true,
    "custom": true,
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

    public static GetColumnTypeFromColumnData(data: ColumnData): ColumnTypes {
        if (data.Type.toLowerCase().includes("string")) {
            return ColumnTypes.string
        }
        else if (data.Type.toLowerCase().includes("double") || 
            data.Type.toLowerCase().includes("float") || 
            data.Type.toLowerCase().includes("decimal") || 
            data.Type.toLowerCase().includes("long") || 
            data.Type.toLowerCase().includes("int")) {
            return ColumnTypes.number
        }
        else if (data.Type.toLowerCase().includes("datetime")) {
            return ColumnTypes.date
        }
        else if (data.Type.toLowerCase().includes("bool")) {
            return ColumnTypes.boolean
        }
        return ColumnTypes.undefined
    }

    public static FromColumnDatas(data: ColumnData[]): GridModel {
        var cols = []
        
        for (let i = 0; i < data.length; i++) {
            const d = data[i]
            const type = GridModel.GetColumnTypeFromColumnData(data[i])
            let col = new ColumnModel(
                true,
                d.Name,
                d.Title,
                type,
                `${d.Title} sort`,
                type == ColumnTypes.date || type == ColumnTypes.number ? TextAligns.center : TextAligns.left,
                d.Order,
                d.MinWidth,
                d.MaxWidth
            );
            cols.push(col)
        }
        
        return new GridModel(cols, true)
    }
}

export class ColumnModel {
    constructor(
        public Show: boolean,
        public ColKey: string,
        public Title: string,
        public ColumnType: ColumnTypes = ColumnTypes.undefined,
        public SortTooltip: string = "",
        public TextAlign: TextAligns = TextAligns.left,
        public Order?: number,
        public MinWidth?: number,
        public MaxWidth?: number
    ) {

    }
}
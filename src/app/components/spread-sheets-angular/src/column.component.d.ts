import { OnChanges, SimpleChanges } from '@angular/core';
import * as GC from '@grapecity/spread-sheets';
import * as ɵngcc0 from '@angular/core';
export declare class ColumnComponent implements OnChanges {
    private changes;
    private sheet?;
    private index?;
    width?: number;
    dataField?: string;
    headerText?: string;
    visible?: boolean;
    resizable?: boolean;
    autoFit?: boolean;
    style?: GC.Spread.Sheets.Style;
    cellType?: GC.Spread.Sheets.CellTypes.Base;
    headerStyle?: GC.Spread.Sheets.Style;
    formatter: any;
    onAttached(sheet: GC.Spread.Sheets.Worksheet, index: number): void;
    private onColumnChanged;
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ColumnComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<ColumnComponent, "gc-column", never, { "width": "width"; "dataField": "dataField"; "headerText": "headerText"; "visible": "visible"; "resizable": "resizable"; "autoFit": "autoFit"; "style": "style"; "cellType": "cellType"; "headerStyle": "headerStyle"; "formatter": "formatter"; }, {}, never, ["*"]>;
}

//# sourceMappingURL=column.component.d.ts.map
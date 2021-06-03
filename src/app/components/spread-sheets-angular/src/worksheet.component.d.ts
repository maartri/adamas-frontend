import { AfterViewInit, OnChanges, QueryList, SimpleChanges } from '@angular/core';
import { ColumnComponent } from './column.component';
import * as GC from '@grapecity/spread-sheets';
import * as ɵngcc0 from '@angular/core';
export declare class WorksheetComponent implements OnChanges, AfterViewInit {
    private sheet;
    columns?: QueryList<ColumnComponent>;
    rowCount?: number;
    colCount?: number;
    dataSource: any;
    name?: string;
    frozenColumnCount?: number;
    frozenRowCount?: number;
    frozenTrailingRowCount?: number;
    frozenTrailingColumnCount?: number;
    allowCellOverflow?: boolean;
    frozenlineColor?: string;
    sheetTabColor?: string;
    selectionPolicy?: number;
    selectionUnit?: number;
    zoom?: number;
    currentTheme?: string;
    clipBoardOptions?: number;
    rowHeaderVisible?: boolean;
    colHeaderVisible?: boolean;
    rowHeaderAutoText?: number;
    colHeaderAutoText?: number;
    rowHeaderAutoTextIndex?: number;
    colHeaderAutoTextIndex?: number;
    isProtected?: boolean;
    showRowOutline?: boolean;
    showColumnOutline?: boolean;
    selectionBackColor?: string;
    selectionBorderColor?: string;
    defaultStyle?: GC.Spread.Sheets.Style;
    rowOutlineInfo?: any[];
    columnOutlineInfo?: any[];
    autoGenerateColumns?: boolean;
    constructor();
    onAttached(): void;
    getSheet(): GC.Spread.Sheets.Worksheet;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<WorksheetComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<WorksheetComponent, "gc-worksheet", never, { "rowCount": "rowCount"; "colCount": "colCount"; "dataSource": "dataSource"; "name": "name"; "frozenColumnCount": "frozenColumnCount"; "frozenRowCount": "frozenRowCount"; "frozenTrailingRowCount": "frozenTrailingRowCount"; "frozenTrailingColumnCount": "frozenTrailingColumnCount"; "allowCellOverflow": "allowCellOverflow"; "frozenlineColor": "frozenlineColor"; "sheetTabColor": "sheetTabColor"; "selectionPolicy": "selectionPolicy"; "selectionUnit": "selectionUnit"; "zoom": "zoom"; "currentTheme": "currentTheme"; "clipBoardOptions": "clipBoardOptions"; "rowHeaderVisible": "rowHeaderVisible"; "colHeaderVisible": "colHeaderVisible"; "rowHeaderAutoText": "rowHeaderAutoText"; "colHeaderAutoText": "colHeaderAutoText"; "rowHeaderAutoTextIndex": "rowHeaderAutoTextIndex"; "colHeaderAutoTextIndex": "colHeaderAutoTextIndex"; "isProtected": "isProtected"; "showRowOutline": "showRowOutline"; "showColumnOutline": "showColumnOutline"; "selectionBackColor": "selectionBackColor"; "selectionBorderColor": "selectionBorderColor"; "defaultStyle": "defaultStyle"; "rowOutlineInfo": "rowOutlineInfo"; "columnOutlineInfo": "columnOutlineInfo"; "autoGenerateColumns": "autoGenerateColumns"; }, {}, ["columns"], ["*"]>;
}

//# sourceMappingURL=worksheet.component.d.ts.map
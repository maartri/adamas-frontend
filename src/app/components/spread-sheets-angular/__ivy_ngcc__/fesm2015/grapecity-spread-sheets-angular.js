import { CommonModule } from '@angular/common';
import { Component, Input, ContentChildren, EventEmitter, ElementRef, Output, NgModule } from '@angular/core';
import { Spread } from '@grapecity/spread-sheets';

/*import_begin*/
/*import_end*/
/*code_begin*/
import * as ɵngcc0 from '@angular/core';
import * as ɵngcc1 from '@angular/common';

const _c0 = ["*"];
class ColumnComponent {
    constructor() {
        this.changes = {};
    }
    onAttached(sheet, index) {
        this.sheet = sheet;
        this.index = index;
        this.onColumnChanged();
    }
    onColumnChanged() {
        if (this.sheet) {
            const sheet = this.sheet;
            sheet.suspendPaint();
            sheet.suspendEvent();
            const changes = this.changes;
            for (const changeName in changes) {
                let newValue = changes[changeName].currentValue;
                if (newValue === null || newValue === void 0) {
                    continue;
                }
                switch (changeName) {
                    case 'width':
                        newValue = parseInt(newValue, 10);
                        sheet.setColumnWidth(this.index, newValue);
                        break;
                    case 'visible':
                        sheet.setColumnVisible(this.index, newValue);
                        break;
                    case 'resizable':
                        sheet.setColumnResizable(this.index, newValue);
                        break;
                    case 'autoFit':
                        if (newValue) {
                            sheet.autoFitColumn(this.index);
                        }
                        break;
                    case 'style':
                        sheet.setStyle(-1, this.index, newValue);
                        break;
                    case 'headerStyle':
                        sheet.setStyle(-1, this.index, newValue, Spread.Sheets.SheetArea.colHeader);
                        break;
                    case 'cellType':
                        sheet.setCellType(-1, this.index, newValue);
                        break;
                    case 'formatter':
                        sheet.setFormatter(-1, this.index, newValue, Spread.Sheets.SheetArea.viewport);
                        break;
                }
            }
            sheet.resumeEvent();
            sheet.resumePaint();
        }
    }
    ngOnChanges(changes) {
        this.changes = {};
        const changesCache = this.changes;
        for (const changeName in changes) {
            changesCache[changeName] = changes[changeName];
        }
        this.onColumnChanged();
    }
}
ColumnComponent.ɵfac = function ColumnComponent_Factory(t) { return new (t || ColumnComponent)(); };
ColumnComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: ColumnComponent, selectors: [["gc-column"]], inputs: { width: "width", dataField: "dataField", headerText: "headerText", visible: "visible", resizable: "resizable", autoFit: "autoFit", style: "style", cellType: "cellType", headerStyle: "headerStyle", formatter: "formatter" }, features: [ɵngcc0.ɵɵNgOnChangesFeature], ngContentSelectors: _c0, decls: 1, vars: 0, template: function ColumnComponent_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵprojectionDef();
        ɵngcc0.ɵɵprojection(0);
    } }, encapsulation: 2 });
ColumnComponent.propDecorators = {
    width: [{ type: Input }],
    dataField: [{ type: Input }],
    headerText: [{ type: Input }],
    visible: [{ type: Input }],
    resizable: [{ type: Input }],
    autoFit: [{ type: Input }],
    style: [{ type: Input }],
    cellType: [{ type: Input }],
    headerStyle: [{ type: Input }],
    formatter: [{ type: Input }]
};
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵngcc0.ɵsetClassMetadata(ColumnComponent, [{
        type: Component,
        args: [{
                selector: 'gc-column',
                template: `
        <ng-content></ng-content>
    `
            }]
    }], function () { return []; }, { width: [{
            type: Input
        }], dataField: [{
            type: Input
        }], headerText: [{
            type: Input
        }], visible: [{
            type: Input
        }], resizable: [{
            type: Input
        }], autoFit: [{
            type: Input
        }], style: [{
            type: Input
        }], cellType: [{
            type: Input
        }], headerStyle: [{
            type: Input
        }], formatter: [{
            type: Input
        }] }); })();
/*code_end*/

/*import_begin*/
/*code_begin*/
class WorksheetComponent {
    constructor() {
        this.sheet = new Spread.Sheets.Worksheet('');
    }
    onAttached() {
        const sheet = this.sheet;
        const columns = this.columns;
        sheet.suspendPaint();
        sheet.suspendEvent();
        if (this.dataSource) {
            sheet.setDataSource(this.dataSource);
            columns.forEach((columnComponent, index) => {
                if (columnComponent.dataField) {
                    sheet.bindColumn(index, {
                        name: columnComponent.dataField,
                        displayName: columnComponent.headerText,
                    });
                }
            });
        }
        if (columns.length > 0) {
            sheet.setColumnCount(columns.length);
            columns.forEach((columnComponent, index) => {
                columnComponent.onAttached(this.sheet, index);
            });
        }
        sheet.resumeEvent();
        sheet.resumePaint();
    }
    getSheet() {
        return this.sheet;
    }
    ngOnChanges(changes) {
        const sheet = this.sheet;
        sheet.suspendPaint();
        sheet.suspendEvent();
        for (const changeName in changes) {
            const newValue = changes[changeName].currentValue;
            if (newValue === null || newValue === void 0) {
                continue;
            }
            switch (changeName) {
                case 'rowCount':
                    sheet.setRowCount(newValue);
                    break;
                case 'colCount':
                    sheet.setColumnCount(newValue);
                    break;
                case 'name':
                    sheet.name(newValue);
                    break;
                case 'frozenColumnCount':
                    sheet.frozenColumnCount(newValue);
                    break;
                case 'frozenRowCount':
                    sheet.frozenRowCount(newValue);
                    break;
                case 'frozenTrailingRowCount':
                    sheet.frozenTrailingRowCount(newValue);
                    break;
                case 'frozenTrailingColumnCount':
                    sheet.frozenTrailingColumnCount(newValue);
                    break;
                case 'selectionPolicy':
                    sheet.selectionPolicy(newValue);
                    break;
                case 'selectionUnit':
                    sheet.selectionUnit(newValue);
                    break;
                case 'zoom':
                    sheet.zoom(newValue);
                    break;
                case 'currentTheme':
                    sheet.currentTheme(newValue);
                    break;
                case 'defaultStyle':
                    sheet.setDefaultStyle(newValue);
                    break;
                case 'rowOutlineInfo':
                    newValue.forEach((item) => {
                        sheet.rowOutlines.group(item.index, item.count);
                    });
                    sheet.repaint();
                    break;
                case 'columnOutlineInfo':
                    newValue.forEach((item) => {
                        sheet.columnOutlines.group(item.index, item.count);
                    });
                    sheet.repaint();
                    break;
                case 'showRowOutline':
                    sheet.showRowOutline(newValue);
                    break;
                case 'showColumnOutline':
                    sheet.showColumnOutline(newValue);
                    break;
                case 'dataSource':
                    sheet.setDataSource(newValue);
                    break;
                case 'autoGenerateColumns':
                    sheet[changeName] = newValue;
                default:
                    sheet.options[changeName] = newValue;
            }
        }
        sheet.resumeEvent();
        sheet.resumePaint();
    }
    ngAfterViewInit() {
        this.columns.changes.subscribe(() => { this.onAttached(); });
    }
    ngOnDestroy() {
        const sheet = this.sheet;
        const spread = sheet ? sheet.getParent() : null;
        if (spread) {
            const sheetIndex = spread.getSheetIndex(sheet.name());
            if (sheetIndex !== void 0) {
                spread.removeSheet(sheetIndex);
            }
        }
    }
}
WorksheetComponent.ɵfac = function WorksheetComponent_Factory(t) { return new (t || WorksheetComponent)(); };
WorksheetComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: WorksheetComponent, selectors: [["gc-worksheet"]], contentQueries: function WorksheetComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
        ɵngcc0.ɵɵcontentQuery(dirIndex, ColumnComponent, 0);
    } if (rf & 2) {
        let _t;
        ɵngcc0.ɵɵqueryRefresh(_t = ɵngcc0.ɵɵloadQuery()) && (ctx.columns = _t);
    } }, inputs: { rowCount: "rowCount", colCount: "colCount", dataSource: "dataSource", name: "name", frozenColumnCount: "frozenColumnCount", frozenRowCount: "frozenRowCount", frozenTrailingRowCount: "frozenTrailingRowCount", frozenTrailingColumnCount: "frozenTrailingColumnCount", allowCellOverflow: "allowCellOverflow", frozenlineColor: "frozenlineColor", sheetTabColor: "sheetTabColor", selectionPolicy: "selectionPolicy", selectionUnit: "selectionUnit", zoom: "zoom", currentTheme: "currentTheme", clipBoardOptions: "clipBoardOptions", rowHeaderVisible: "rowHeaderVisible", colHeaderVisible: "colHeaderVisible", rowHeaderAutoText: "rowHeaderAutoText", colHeaderAutoText: "colHeaderAutoText", rowHeaderAutoTextIndex: "rowHeaderAutoTextIndex", colHeaderAutoTextIndex: "colHeaderAutoTextIndex", isProtected: "isProtected", showRowOutline: "showRowOutline", showColumnOutline: "showColumnOutline", selectionBackColor: "selectionBackColor", selectionBorderColor: "selectionBorderColor", defaultStyle: "defaultStyle", rowOutlineInfo: "rowOutlineInfo", columnOutlineInfo: "columnOutlineInfo", autoGenerateColumns: "autoGenerateColumns" }, features: [ɵngcc0.ɵɵNgOnChangesFeature], ngContentSelectors: _c0, decls: 1, vars: 0, template: function WorksheetComponent_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵprojectionDef();
        ɵngcc0.ɵɵprojection(0);
    } }, encapsulation: 2 });
WorksheetComponent.ctorParameters = () => [];
WorksheetComponent.propDecorators = {
    columns: [{ type: ContentChildren, args: [ColumnComponent,] }],
    rowCount: [{ type: Input }],
    colCount: [{ type: Input }],
    dataSource: [{ type: Input }],
    name: [{ type: Input }],
    frozenColumnCount: [{ type: Input }],
    frozenRowCount: [{ type: Input }],
    frozenTrailingRowCount: [{ type: Input }],
    frozenTrailingColumnCount: [{ type: Input }],
    allowCellOverflow: [{ type: Input }],
    frozenlineColor: [{ type: Input }],
    sheetTabColor: [{ type: Input }],
    selectionPolicy: [{ type: Input }],
    selectionUnit: [{ type: Input }],
    zoom: [{ type: Input }],
    currentTheme: [{ type: Input }],
    clipBoardOptions: [{ type: Input }],
    rowHeaderVisible: [{ type: Input }],
    colHeaderVisible: [{ type: Input }],
    rowHeaderAutoText: [{ type: Input }],
    colHeaderAutoText: [{ type: Input }],
    rowHeaderAutoTextIndex: [{ type: Input }],
    colHeaderAutoTextIndex: [{ type: Input }],
    isProtected: [{ type: Input }],
    showRowOutline: [{ type: Input }],
    showColumnOutline: [{ type: Input }],
    selectionBackColor: [{ type: Input }],
    selectionBorderColor: [{ type: Input }],
    defaultStyle: [{ type: Input }],
    rowOutlineInfo: [{ type: Input }],
    columnOutlineInfo: [{ type: Input }],
    autoGenerateColumns: [{ type: Input }]
};
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵngcc0.ɵsetClassMetadata(WorksheetComponent, [{
        type: Component,
        args: [{
                selector: 'gc-worksheet',
                template: `
        <ng-content></ng-content>
    `
            }]
    }], function () { return []; }, { columns: [{
            type: ContentChildren,
            args: [ColumnComponent]
        }], rowCount: [{
            type: Input
        }], colCount: [{
            type: Input
        }], dataSource: [{
            type: Input
        }], name: [{
            type: Input
        }], frozenColumnCount: [{
            type: Input
        }], frozenRowCount: [{
            type: Input
        }], frozenTrailingRowCount: [{
            type: Input
        }], frozenTrailingColumnCount: [{
            type: Input
        }], allowCellOverflow: [{
            type: Input
        }], frozenlineColor: [{
            type: Input
        }], sheetTabColor: [{
            type: Input
        }], selectionPolicy: [{
            type: Input
        }], selectionUnit: [{
            type: Input
        }], zoom: [{
            type: Input
        }], currentTheme: [{
            type: Input
        }], clipBoardOptions: [{
            type: Input
        }], rowHeaderVisible: [{
            type: Input
        }], colHeaderVisible: [{
            type: Input
        }], rowHeaderAutoText: [{
            type: Input
        }], colHeaderAutoText: [{
            type: Input
        }], rowHeaderAutoTextIndex: [{
            type: Input
        }], colHeaderAutoTextIndex: [{
            type: Input
        }], isProtected: [{
            type: Input
        }], showRowOutline: [{
            type: Input
        }], showColumnOutline: [{
            type: Input
        }], selectionBackColor: [{
            type: Input
        }], selectionBorderColor: [{
            type: Input
        }], defaultStyle: [{
            type: Input
        }], rowOutlineInfo: [{
            type: Input
        }], columnOutlineInfo: [{
            type: Input
        }], autoGenerateColumns: [{
            type: Input
        }] }); })();
/*code_end*/

/*import_begin*/
/*code_begin*/
class SpreadSheetsComponent {
    constructor(elRef) {
        this.elRef = elRef;
        this.style = {
            width: '800px',
            height: '600px',
        };
        // outputs events
        this.workbookInitialized = new EventEmitter();
        this.validationError = new EventEmitter();
        this.cellClick = new EventEmitter();
        this.cellDoubleClick = new EventEmitter();
        this.enterCell = new EventEmitter();
        this.leaveCell = new EventEmitter();
        this.valueChanged = new EventEmitter();
        this.topRowChanged = new EventEmitter();
        this.leftColumnChanged = new EventEmitter();
        this.invalidOperation = new EventEmitter();
        this.rangeFiltering = new EventEmitter();
        this.rangeFiltered = new EventEmitter();
        this.tableFiltering = new EventEmitter();
        this.tableFiltered = new EventEmitter();
        this.rangeSorting = new EventEmitter();
        this.rangeSorted = new EventEmitter();
        this.clipboardChanging = new EventEmitter();
        this.clipboardChanged = new EventEmitter();
        this.clipboardPasting = new EventEmitter();
        this.clipboardPasted = new EventEmitter();
        this.columnWidthChanging = new EventEmitter();
        this.columnWidthChanged = new EventEmitter();
        this.rowHeightChanging = new EventEmitter();
        this.rowHeightChanged = new EventEmitter();
        this.dragDropBlock = new EventEmitter();
        this.dragDropBlockCompleted = new EventEmitter();
        this.dragFillBlock = new EventEmitter();
        this.dragFillBlockCompleted = new EventEmitter();
        this.editStarting = new EventEmitter();
        this.editChange = new EventEmitter();
        this.editEnding = new EventEmitter();
        this.editEnd = new EventEmitter();
        this.editEnded = new EventEmitter();
        this.rangeGroupStateChanging = new EventEmitter();
        this.rangeGroupStateChanged = new EventEmitter();
        this.selectionChanging = new EventEmitter();
        this.selectionChanged = new EventEmitter();
        this.sheetTabClick = new EventEmitter();
        this.sheetTabDoubleClick = new EventEmitter();
        this.sheetNameChanging = new EventEmitter();
        this.sheetNameChanged = new EventEmitter();
        this.userZooming = new EventEmitter();
        this.userFormulaEntered = new EventEmitter();
        this.cellChanged = new EventEmitter();
        this.columnChanged = new EventEmitter();
        this.rowChanged = new EventEmitter();
        this.activeSheetChanging = new EventEmitter();
        this.activeSheetChanged = new EventEmitter();
        this.sparklineChanged = new EventEmitter();
        this.rangeChanged = new EventEmitter();
        this.buttonClicked = new EventEmitter();
        this.editorStatusChanged = new EventEmitter();
        this.floatingObjectChanged = new EventEmitter();
        this.floatingObjectSelectionChanged = new EventEmitter();
        this.pictureChanged = new EventEmitter();
        this.floatingObjectRemoving = new EventEmitter();
        this.floatingObjectRemoved = new EventEmitter();
        this.pictureSelectionChanged = new EventEmitter();
        this.floatingObjectLoaded = new EventEmitter();
        this.touchToolStripOpening = new EventEmitter();
        this.commentChanged = new EventEmitter();
        this.commentRemoving = new EventEmitter();
        this.commentRemoved = new EventEmitter();
        this.slicerChanged = new EventEmitter();
    }
    ngAfterViewInit() {
        const elRef = this.elRef;
        const dom = elRef.nativeElement;
        const hostElement = dom.querySelector('div');
        this.spread = new Spread.Sheets.Workbook(hostElement, { sheetCount: 0 });
        this.setSpreadOptions();
        this.initSheets();
        this.sheets.changes.subscribe((changes) => {
            this.onSheetsChanged(changes);
        }); // may change sheets using bingidng.
        this.bindCustomEvent(this.spread);
        this.workbookInitialized.emit({ spread: this.spread });
    }
    onSheetsChanged(sheetComponents) {
        const spread = this.spread;
        spread.suspendPaint();
        if (sheetComponents) {
            sheetComponents.forEach((sheetComponent, index) => {
                const sheet = sheetComponent.getSheet();
                if (sheet && !sheet.getParent()) {
                    spread.addSheet(index, sheetComponent.getSheet());
                    sheetComponent.onAttached();
                }
            });
        }
        spread.resumePaint();
    }
    initSheets() {
        const sheets = this.sheets;
        const spread = this.spread;
        spread.clearSheets();
        sheets.forEach((sheetComponent, index) => {
            spread.addSheet(index, sheetComponent.getSheet());
            sheetComponent.onAttached();
        });
        // when there is no sheet, add default sheet to spread
        if (sheets.length === 0) {
            spread.addSheet(0, new Spread.Sheets.Worksheet(''));
        }
    }
    bindCustomEvent(spread) {
        const customEventNameSpace = '.ng';
        const events = ['ValidationError', 'CellClick', 'CellDoubleClick', 'EnterCell',
            'LeaveCell', 'ValueChanged', 'TopRowChanged', 'LeftColumnChanged',
            'InvalidOperation', 'RangeFiltering', 'RangeFiltered', 'TableFiltering',
            'TableFiltered', 'RangeSorting', 'RangeSorted', 'ClipboardChanging',
            'ClipboardChanged', 'ClipboardPasting', 'ClipboardPasted', 'ColumnWidthChanging',
            'ColumnWidthChanged', 'RowHeightChanging', 'RowHeightChanged', 'DragDropBlock',
            'DragDropBlockCompleted', 'DragFillBlock', 'DragFillBlockCompleted', 'EditStarting',
            'EditChange', 'EditEnding', 'EditEnd', 'EditEnded', 'RangeGroupStateChanging',
            'RangeGroupStateChanged', 'SelectionChanging', 'SelectionChanged', 'SheetTabClick',
            'SheetTabDoubleClick', 'SheetNameChanging', 'SheetNameChanged',
            'UserZooming', 'UserFormulaEntered', 'CellChanged', 'ColumnChanged',
            'RowChanged', 'ActiveSheetChanging', 'ActiveSheetChanged',
            'SparklineChanged',
            'RangeChanged', 'ButtonClicked', 'EditorStatusChanged',
            'FloatingObjectChanged', 'FloatingObjectSelectionChanged', 'PictureChanged',
            'FloatingObjectRemoving', 'FloatingObjectRemoved', 'PictureSelectionChanged',
            'FloatingObjectLoaded', 'TouchToolStripOpening', 'CommentChanged', 'CommentRemoving', 'CommentRemoved', 'SlicerChanged'];
        events.forEach((event) => {
            spread.bind(event + customEventNameSpace, (event, data) => {
                const eventType = event.type;
                const camelCaseEvent = eventType[0].toLowerCase() + eventType.substr(1);
                this[camelCaseEvent].emit(data);
            });
        });
    }
    setSpreadOptions() {
        const spread = this.spread;
        if (!this.spread) {
            return;
        }
        spread.suspendEvent();
        spread.suspendPaint();
        const options = this.spreadOptions;
        options && options.forEach((option) => {
            if (option.name === 'name') {
                spread.name = option.value;
            }
            else {
                spread.options[option.name] = option.value;
            }
        });
        spread.resumePaint();
        spread.resumeEvent();
    }
    ngOnChanges(changes) {
        const options = [];
        for (const changeName in changes) {
            const newValue = changes[changeName].currentValue;
            if (newValue !== null && newValue !== void 0) {
                switch (changeName) {
                    case 'hostStyle':
                        this.style = newValue;
                        break;
                    case 'hostClass':
                        break;
                    default:
                        options.push({ name: changeName, value: newValue });
                }
            }
        }
        this.spreadOptions = options;
        this.setSpreadOptions();
    }
    ngOnDestroy() {
        this.spread.destroy();
    }
}
SpreadSheetsComponent.ɵfac = function SpreadSheetsComponent_Factory(t) { return new (t || SpreadSheetsComponent)(ɵngcc0.ɵɵdirectiveInject(ɵngcc0.ElementRef)); };
SpreadSheetsComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: SpreadSheetsComponent, selectors: [["gc-spread-sheets"]], contentQueries: function SpreadSheetsComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
        ɵngcc0.ɵɵcontentQuery(dirIndex, WorksheetComponent, 0);
    } if (rf & 2) {
        let _t;
        ɵngcc0.ɵɵqueryRefresh(_t = ɵngcc0.ɵɵloadQuery()) && (ctx.sheets = _t);
    } }, inputs: { allowUserResize: "allowUserResize", allowUserZoom: "allowUserZoom", allowUserEditFormula: "allowUserEditFormula", allowUserDragFill: "allowUserDragFill", allowUserDragDrop: "allowUserDragDrop", allowUserDragMerge: "allowUserDragMerge", allowUndo: "allowUndo", allowSheetReorder: "allowSheetReorder", allowContextMenu: "allowContextMenu", allowUserDeselect: "allowUserDeselect", allowCopyPasteExcelStyle: "allowCopyPasteExcelStyle", allowExtendPasteRange: "allowExtendPasteRange", cutCopyIndicatorVisible: "cutCopyIndicatorVisible", cutCopyIndicatorBorderColor: "cutCopyIndicatorBorderColor", copyPasteHeaderOptions: "copyPasteHeaderOptions", defaultDragFillType: "defaultDragFillType", enableFormulaTextbox: "enableFormulaTextbox", highlightInvalidData: "highlightInvalidData", newTabVisible: "newTabVisible", tabStripVisible: "tabStripVisible", tabEditable: "tabEditable", tabStripRatio: "tabStripRatio", tabNavigationVisible: "tabNavigationVisible", autoFitType: "autoFitType", referenceStyle: "referenceStyle", backColor: "backColor", grayAreaBackColor: "grayAreaBackColor", resizeZeroIndicator: "resizeZeroIndicator", showVerticalScrollbar: "showVerticalScrollbar", showHorizontalScrollbar: "showHorizontalScrollbar", scrollbarMaxAlign: "scrollbarMaxAlign", scrollIgnoreHidden: "scrollIgnoreHidden", hostStyle: "hostStyle", hostClass: "hostClass", hideSelection: "hideSelection", name: "name", backgroundImage: "backgroundImage", backgroundImageLayout: "backgroundImageLayout", showScrollTip: "showScrollTip", showResizeTip: "showResizeTip", showDragDropTip: "showDragDropTip", showDragFillTip: "showDragFillTip", showDragFillSmartTag: "showDragFillSmartTag", scrollbarShowMax: "scrollbarShowMax", useTouchLayout: "useTouchLayout" }, outputs: { workbookInitialized: "workbookInitialized", validationError: "validationError", cellClick: "cellClick", cellDoubleClick: "cellDoubleClick", enterCell: "enterCell", leaveCell: "leaveCell", valueChanged: "valueChanged", topRowChanged: "topRowChanged", leftColumnChanged: "leftColumnChanged", invalidOperation: "invalidOperation", rangeFiltering: "rangeFiltering", rangeFiltered: "rangeFiltered", tableFiltering: "tableFiltering", tableFiltered: "tableFiltered", rangeSorting: "rangeSorting", rangeSorted: "rangeSorted", clipboardChanging: "clipboardChanging", clipboardChanged: "clipboardChanged", clipboardPasting: "clipboardPasting", clipboardPasted: "clipboardPasted", columnWidthChanging: "columnWidthChanging", columnWidthChanged: "columnWidthChanged", rowHeightChanging: "rowHeightChanging", rowHeightChanged: "rowHeightChanged", dragDropBlock: "dragDropBlock", dragDropBlockCompleted: "dragDropBlockCompleted", dragFillBlock: "dragFillBlock", dragFillBlockCompleted: "dragFillBlockCompleted", editStarting: "editStarting", editChange: "editChange", editEnding: "editEnding", editEnd: "editEnd", editEnded: "editEnded", rangeGroupStateChanging: "rangeGroupStateChanging", rangeGroupStateChanged: "rangeGroupStateChanged", selectionChanging: "selectionChanging", selectionChanged: "selectionChanged", sheetTabClick: "sheetTabClick", sheetTabDoubleClick: "sheetTabDoubleClick", sheetNameChanging: "sheetNameChanging", sheetNameChanged: "sheetNameChanged", userZooming: "userZooming", userFormulaEntered: "userFormulaEntered", cellChanged: "cellChanged", columnChanged: "columnChanged", rowChanged: "rowChanged", activeSheetChanging: "activeSheetChanging", activeSheetChanged: "activeSheetChanged", sparklineChanged: "sparklineChanged", rangeChanged: "rangeChanged", buttonClicked: "buttonClicked", editorStatusChanged: "editorStatusChanged", floatingObjectChanged: "floatingObjectChanged", floatingObjectSelectionChanged: "floatingObjectSelectionChanged", pictureChanged: "pictureChanged", floatingObjectRemoving: "floatingObjectRemoving", floatingObjectRemoved: "floatingObjectRemoved", pictureSelectionChanged: "pictureSelectionChanged", floatingObjectLoaded: "floatingObjectLoaded", touchToolStripOpening: "touchToolStripOpening", commentChanged: "commentChanged", commentRemoving: "commentRemoving", commentRemoved: "commentRemoved", slicerChanged: "slicerChanged" }, features: [ɵngcc0.ɵɵNgOnChangesFeature], ngContentSelectors: _c0, decls: 2, vars: 2, consts: [[3, "ngStyle", "ngClass"]], template: function SpreadSheetsComponent_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵprojectionDef();
        ɵngcc0.ɵɵelementStart(0, "div", 0);
        ɵngcc0.ɵɵprojection(1);
        ɵngcc0.ɵɵelementEnd();
    } if (rf & 2) {
        ɵngcc0.ɵɵproperty("ngStyle", ctx.style)("ngClass", ctx.hostClass);
    } }, directives: [ɵngcc1.NgStyle, ɵngcc1.NgClass], encapsulation: 2 });
SpreadSheetsComponent.ctorParameters = () => [
    { type: ElementRef }
];
SpreadSheetsComponent.propDecorators = {
    allowUserResize: [{ type: Input }],
    allowUserZoom: [{ type: Input }],
    allowUserEditFormula: [{ type: Input }],
    allowUserDragFill: [{ type: Input }],
    allowUserDragDrop: [{ type: Input }],
    allowUserDragMerge: [{ type: Input }],
    allowUndo: [{ type: Input }],
    allowSheetReorder: [{ type: Input }],
    allowContextMenu: [{ type: Input }],
    allowUserDeselect: [{ type: Input }],
    allowCopyPasteExcelStyle: [{ type: Input }],
    allowExtendPasteRange: [{ type: Input }],
    cutCopyIndicatorVisible: [{ type: Input }],
    cutCopyIndicatorBorderColor: [{ type: Input }],
    copyPasteHeaderOptions: [{ type: Input }],
    defaultDragFillType: [{ type: Input }],
    enableFormulaTextbox: [{ type: Input }],
    highlightInvalidData: [{ type: Input }],
    newTabVisible: [{ type: Input }],
    tabStripVisible: [{ type: Input }],
    tabEditable: [{ type: Input }],
    tabStripRatio: [{ type: Input }],
    tabNavigationVisible: [{ type: Input }],
    autoFitType: [{ type: Input }],
    referenceStyle: [{ type: Input }],
    backColor: [{ type: Input }],
    grayAreaBackColor: [{ type: Input }],
    resizeZeroIndicator: [{ type: Input }],
    showVerticalScrollbar: [{ type: Input }],
    showHorizontalScrollbar: [{ type: Input }],
    scrollbarMaxAlign: [{ type: Input }],
    scrollIgnoreHidden: [{ type: Input }],
    hostStyle: [{ type: Input }],
    hostClass: [{ type: Input }],
    hideSelection: [{ type: Input }],
    name: [{ type: Input }],
    backgroundImage: [{ type: Input }],
    backgroundImageLayout: [{ type: Input }],
    showScrollTip: [{ type: Input }],
    showResizeTip: [{ type: Input }],
    showDragDropTip: [{ type: Input }],
    showDragFillTip: [{ type: Input }],
    showDragFillSmartTag: [{ type: Input }],
    scrollbarShowMax: [{ type: Input }],
    useTouchLayout: [{ type: Input }],
    workbookInitialized: [{ type: Output }],
    validationError: [{ type: Output }],
    cellClick: [{ type: Output }],
    cellDoubleClick: [{ type: Output }],
    enterCell: [{ type: Output }],
    leaveCell: [{ type: Output }],
    valueChanged: [{ type: Output }],
    topRowChanged: [{ type: Output }],
    leftColumnChanged: [{ type: Output }],
    invalidOperation: [{ type: Output }],
    rangeFiltering: [{ type: Output }],
    rangeFiltered: [{ type: Output }],
    tableFiltering: [{ type: Output }],
    tableFiltered: [{ type: Output }],
    rangeSorting: [{ type: Output }],
    rangeSorted: [{ type: Output }],
    clipboardChanging: [{ type: Output }],
    clipboardChanged: [{ type: Output }],
    clipboardPasting: [{ type: Output }],
    clipboardPasted: [{ type: Output }],
    columnWidthChanging: [{ type: Output }],
    columnWidthChanged: [{ type: Output }],
    rowHeightChanging: [{ type: Output }],
    rowHeightChanged: [{ type: Output }],
    dragDropBlock: [{ type: Output }],
    dragDropBlockCompleted: [{ type: Output }],
    dragFillBlock: [{ type: Output }],
    dragFillBlockCompleted: [{ type: Output }],
    editStarting: [{ type: Output }],
    editChange: [{ type: Output }],
    editEnding: [{ type: Output }],
    editEnd: [{ type: Output }],
    editEnded: [{ type: Output }],
    rangeGroupStateChanging: [{ type: Output }],
    rangeGroupStateChanged: [{ type: Output }],
    selectionChanging: [{ type: Output }],
    selectionChanged: [{ type: Output }],
    sheetTabClick: [{ type: Output }],
    sheetTabDoubleClick: [{ type: Output }],
    sheetNameChanging: [{ type: Output }],
    sheetNameChanged: [{ type: Output }],
    userZooming: [{ type: Output }],
    userFormulaEntered: [{ type: Output }],
    cellChanged: [{ type: Output }],
    columnChanged: [{ type: Output }],
    rowChanged: [{ type: Output }],
    activeSheetChanging: [{ type: Output }],
    activeSheetChanged: [{ type: Output }],
    sparklineChanged: [{ type: Output }],
    rangeChanged: [{ type: Output }],
    buttonClicked: [{ type: Output }],
    editorStatusChanged: [{ type: Output }],
    floatingObjectChanged: [{ type: Output }],
    floatingObjectSelectionChanged: [{ type: Output }],
    pictureChanged: [{ type: Output }],
    floatingObjectRemoving: [{ type: Output }],
    floatingObjectRemoved: [{ type: Output }],
    pictureSelectionChanged: [{ type: Output }],
    floatingObjectLoaded: [{ type: Output }],
    touchToolStripOpening: [{ type: Output }],
    commentChanged: [{ type: Output }],
    commentRemoving: [{ type: Output }],
    commentRemoved: [{ type: Output }],
    slicerChanged: [{ type: Output }],
    sheets: [{ type: ContentChildren, args: [WorksheetComponent,] }]
};
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵngcc0.ɵsetClassMetadata(SpreadSheetsComponent, [{
        type: Component,
        args: [{
                selector: 'gc-spread-sheets',
                template: `
        <div [ngStyle]="style" [ngClass]="hostClass">
            <ng-content></ng-content>
        </div>
    `
            }]
    }], function () { return [{ type: ɵngcc0.ElementRef }]; }, { workbookInitialized: [{
            type: Output
        }], validationError: [{
            type: Output
        }], cellClick: [{
            type: Output
        }], cellDoubleClick: [{
            type: Output
        }], enterCell: [{
            type: Output
        }], leaveCell: [{
            type: Output
        }], valueChanged: [{
            type: Output
        }], topRowChanged: [{
            type: Output
        }], leftColumnChanged: [{
            type: Output
        }], invalidOperation: [{
            type: Output
        }], rangeFiltering: [{
            type: Output
        }], rangeFiltered: [{
            type: Output
        }], tableFiltering: [{
            type: Output
        }], tableFiltered: [{
            type: Output
        }], rangeSorting: [{
            type: Output
        }], rangeSorted: [{
            type: Output
        }], clipboardChanging: [{
            type: Output
        }], clipboardChanged: [{
            type: Output
        }], clipboardPasting: [{
            type: Output
        }], clipboardPasted: [{
            type: Output
        }], columnWidthChanging: [{
            type: Output
        }], columnWidthChanged: [{
            type: Output
        }], rowHeightChanging: [{
            type: Output
        }], rowHeightChanged: [{
            type: Output
        }], dragDropBlock: [{
            type: Output
        }], dragDropBlockCompleted: [{
            type: Output
        }], dragFillBlock: [{
            type: Output
        }], dragFillBlockCompleted: [{
            type: Output
        }], editStarting: [{
            type: Output
        }], editChange: [{
            type: Output
        }], editEnding: [{
            type: Output
        }], editEnd: [{
            type: Output
        }], editEnded: [{
            type: Output
        }], rangeGroupStateChanging: [{
            type: Output
        }], rangeGroupStateChanged: [{
            type: Output
        }], selectionChanging: [{
            type: Output
        }], selectionChanged: [{
            type: Output
        }], sheetTabClick: [{
            type: Output
        }], sheetTabDoubleClick: [{
            type: Output
        }], sheetNameChanging: [{
            type: Output
        }], sheetNameChanged: [{
            type: Output
        }], userZooming: [{
            type: Output
        }], userFormulaEntered: [{
            type: Output
        }], cellChanged: [{
            type: Output
        }], columnChanged: [{
            type: Output
        }], rowChanged: [{
            type: Output
        }], activeSheetChanging: [{
            type: Output
        }], activeSheetChanged: [{
            type: Output
        }], sparklineChanged: [{
            type: Output
        }], rangeChanged: [{
            type: Output
        }], buttonClicked: [{
            type: Output
        }], editorStatusChanged: [{
            type: Output
        }], floatingObjectChanged: [{
            type: Output
        }], floatingObjectSelectionChanged: [{
            type: Output
        }], pictureChanged: [{
            type: Output
        }], floatingObjectRemoving: [{
            type: Output
        }], floatingObjectRemoved: [{
            type: Output
        }], pictureSelectionChanged: [{
            type: Output
        }], floatingObjectLoaded: [{
            type: Output
        }], touchToolStripOpening: [{
            type: Output
        }], commentChanged: [{
            type: Output
        }], commentRemoving: [{
            type: Output
        }], commentRemoved: [{
            type: Output
        }], slicerChanged: [{
            type: Output
        }], allowUserResize: [{
            type: Input
        }], allowUserZoom: [{
            type: Input
        }], allowUserEditFormula: [{
            type: Input
        }], allowUserDragFill: [{
            type: Input
        }], allowUserDragDrop: [{
            type: Input
        }], allowUserDragMerge: [{
            type: Input
        }], allowUndo: [{
            type: Input
        }], allowSheetReorder: [{
            type: Input
        }], allowContextMenu: [{
            type: Input
        }], allowUserDeselect: [{
            type: Input
        }], allowCopyPasteExcelStyle: [{
            type: Input
        }], allowExtendPasteRange: [{
            type: Input
        }], cutCopyIndicatorVisible: [{
            type: Input
        }], cutCopyIndicatorBorderColor: [{
            type: Input
        }], copyPasteHeaderOptions: [{
            type: Input
        }], defaultDragFillType: [{
            type: Input
        }], enableFormulaTextbox: [{
            type: Input
        }], highlightInvalidData: [{
            type: Input
        }], newTabVisible: [{
            type: Input
        }], tabStripVisible: [{
            type: Input
        }], tabEditable: [{
            type: Input
        }], tabStripRatio: [{
            type: Input
        }], tabNavigationVisible: [{
            type: Input
        }], autoFitType: [{
            type: Input
        }], referenceStyle: [{
            type: Input
        }], backColor: [{
            type: Input
        }], grayAreaBackColor: [{
            type: Input
        }], resizeZeroIndicator: [{
            type: Input
        }], showVerticalScrollbar: [{
            type: Input
        }], showHorizontalScrollbar: [{
            type: Input
        }], scrollbarMaxAlign: [{
            type: Input
        }], scrollIgnoreHidden: [{
            type: Input
        }], hostStyle: [{
            type: Input
        }], hostClass: [{
            type: Input
        }], hideSelection: [{
            type: Input
        }], name: [{
            type: Input
        }], backgroundImage: [{
            type: Input
        }], backgroundImageLayout: [{
            type: Input
        }], showScrollTip: [{
            type: Input
        }], showResizeTip: [{
            type: Input
        }], showDragDropTip: [{
            type: Input
        }], showDragFillTip: [{
            type: Input
        }], showDragFillSmartTag: [{
            type: Input
        }], scrollbarShowMax: [{
            type: Input
        }], useTouchLayout: [{
            type: Input
        }], sheets: [{
            type: ContentChildren,
            args: [WorksheetComponent]
        }] }); })();
/*code_end*/

/*import_begin*/
/*code_begin*/
class SpreadSheetsModule {
}
SpreadSheetsModule.ɵfac = function SpreadSheetsModule_Factory(t) { return new (t || SpreadSheetsModule)(); };
SpreadSheetsModule.ɵmod = ɵngcc0.ɵɵdefineNgModule({ type: SpreadSheetsModule });
SpreadSheetsModule.ɵinj = ɵngcc0.ɵɵdefineInjector({ imports: [[CommonModule]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵngcc0.ɵɵsetNgModuleScope(SpreadSheetsModule, { declarations: function () { return [SpreadSheetsComponent, WorksheetComponent, ColumnComponent]; }, imports: function () { return [CommonModule]; }, exports: function () { return [SpreadSheetsComponent, WorksheetComponent, ColumnComponent]; } }); })();
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵngcc0.ɵsetClassMetadata(SpreadSheetsModule, [{
        type: NgModule,
        args: [{
                imports: [CommonModule],
                declarations: [SpreadSheetsComponent, WorksheetComponent, ColumnComponent],
                exports: [SpreadSheetsComponent, WorksheetComponent, ColumnComponent]
            }]
    }], null, null); })();
/*code_end*/

/**
 * Generated bundle index. Do not edit.
 */

export { SpreadSheetsModule, SpreadSheetsComponent as ɵa, WorksheetComponent as ɵb, ColumnComponent as ɵc };

//# sourceMappingURL=grapecity-spread-sheets-angular.js.map
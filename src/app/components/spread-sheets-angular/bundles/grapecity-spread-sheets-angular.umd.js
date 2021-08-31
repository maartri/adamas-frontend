(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('@grapecity/spread-sheets')) :
    typeof define === 'function' && define.amd ? define('@grapecity/spread-sheets-angular', ['exports', '@angular/common', '@angular/core', '@grapecity/spread-sheets'], factory) :
    (global = global || self, factory((global.grapecity = global.grapecity || {}, global.grapecity['spread-sheets-angular'] = {}), global.ng.common, global.ng.core, global.GC));
}(this, (function (exports, common, core, GC) { 'use strict';

    /*import_begin*/
    /*import_end*/
    /*code_begin*/
    var ColumnComponent = /** @class */ (function () {
        function ColumnComponent() {
            this.changes = {};
        }
        ColumnComponent.prototype.onAttached = function (sheet, index) {
            this.sheet = sheet;
            this.index = index;
            this.onColumnChanged();
        };
        ColumnComponent.prototype.onColumnChanged = function () {
            if (this.sheet) {
                var sheet = this.sheet;
                sheet.suspendPaint();
                sheet.suspendEvent();
                var changes = this.changes;
                for (var changeName in changes) {
                    var newValue = changes[changeName].currentValue;
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
                            sheet.setStyle(-1, this.index, newValue, GC.Spread.Sheets.SheetArea.colHeader);
                            break;
                        case 'cellType':
                            sheet.setCellType(-1, this.index, newValue);
                            break;
                        case 'formatter':
                            sheet.setFormatter(-1, this.index, newValue, GC.Spread.Sheets.SheetArea.viewport);
                            break;
                    }
                }
                sheet.resumeEvent();
                sheet.resumePaint();
            }
        };
        ColumnComponent.prototype.ngOnChanges = function (changes) {
            this.changes = {};
            var changesCache = this.changes;
            for (var changeName in changes) {
                changesCache[changeName] = changes[changeName];
            }
            this.onColumnChanged();
        };
        return ColumnComponent;
    }());
    ColumnComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'gc-column',
                    template: "\n        <ng-content></ng-content>\n    "
                },] }
    ];
    ColumnComponent.propDecorators = {
        width: [{ type: core.Input }],
        dataField: [{ type: core.Input }],
        headerText: [{ type: core.Input }],
        visible: [{ type: core.Input }],
        resizable: [{ type: core.Input }],
        autoFit: [{ type: core.Input }],
        style: [{ type: core.Input }],
        cellType: [{ type: core.Input }],
        headerStyle: [{ type: core.Input }],
        formatter: [{ type: core.Input }]
    };
    /*code_end*/

    /*import_begin*/
    /*code_begin*/
    var WorksheetComponent = /** @class */ (function () {
        function WorksheetComponent() {
            this.sheet = new GC.Spread.Sheets.Worksheet('');
        }
        WorksheetComponent.prototype.onAttached = function () {
            var _this = this;
            var sheet = this.sheet;
            var columns = this.columns;
            sheet.suspendPaint();
            sheet.suspendEvent();
            if (this.dataSource) {
                sheet.setDataSource(this.dataSource);
                columns.forEach(function (columnComponent, index) {
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
                columns.forEach(function (columnComponent, index) {
                    columnComponent.onAttached(_this.sheet, index);
                });
            }
            sheet.resumeEvent();
            sheet.resumePaint();
        };
        WorksheetComponent.prototype.getSheet = function () {
            return this.sheet;
        };
        WorksheetComponent.prototype.ngOnChanges = function (changes) {
            var sheet = this.sheet;
            sheet.suspendPaint();
            sheet.suspendEvent();
            for (var changeName in changes) {
                var newValue = changes[changeName].currentValue;
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
                        newValue.forEach(function (item) {
                            sheet.rowOutlines.group(item.index, item.count);
                        });
                        sheet.repaint();
                        break;
                    case 'columnOutlineInfo':
                        newValue.forEach(function (item) {
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
        };
        WorksheetComponent.prototype.ngAfterViewInit = function () {
            var _this = this;
            this.columns.changes.subscribe(function () { _this.onAttached(); });
        };
        WorksheetComponent.prototype.ngOnDestroy = function () {
            var sheet = this.sheet;
            var spread = sheet ? sheet.getParent() : null;
            if (spread) {
                var sheetIndex = spread.getSheetIndex(sheet.name());
                if (sheetIndex !== void 0) {
                    spread.removeSheet(sheetIndex);
                }
            }
        };
        return WorksheetComponent;
    }());
    WorksheetComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'gc-worksheet',
                    template: "\n        <ng-content></ng-content>\n    "
                },] }
    ];
    WorksheetComponent.ctorParameters = function () { return []; };
    WorksheetComponent.propDecorators = {
        columns: [{ type: core.ContentChildren, args: [ColumnComponent,] }],
        rowCount: [{ type: core.Input }],
        colCount: [{ type: core.Input }],
        dataSource: [{ type: core.Input }],
        name: [{ type: core.Input }],
        frozenColumnCount: [{ type: core.Input }],
        frozenRowCount: [{ type: core.Input }],
        frozenTrailingRowCount: [{ type: core.Input }],
        frozenTrailingColumnCount: [{ type: core.Input }],
        allowCellOverflow: [{ type: core.Input }],
        frozenlineColor: [{ type: core.Input }],
        sheetTabColor: [{ type: core.Input }],
        selectionPolicy: [{ type: core.Input }],
        selectionUnit: [{ type: core.Input }],
        zoom: [{ type: core.Input }],
        currentTheme: [{ type: core.Input }],
        clipBoardOptions: [{ type: core.Input }],
        rowHeaderVisible: [{ type: core.Input }],
        colHeaderVisible: [{ type: core.Input }],
        rowHeaderAutoText: [{ type: core.Input }],
        colHeaderAutoText: [{ type: core.Input }],
        rowHeaderAutoTextIndex: [{ type: core.Input }],
        colHeaderAutoTextIndex: [{ type: core.Input }],
        isProtected: [{ type: core.Input }],
        showRowOutline: [{ type: core.Input }],
        showColumnOutline: [{ type: core.Input }],
        selectionBackColor: [{ type: core.Input }],
        selectionBorderColor: [{ type: core.Input }],
        defaultStyle: [{ type: core.Input }],
        rowOutlineInfo: [{ type: core.Input }],
        columnOutlineInfo: [{ type: core.Input }],
        autoGenerateColumns: [{ type: core.Input }]
    };
    /*code_end*/

    /*import_begin*/
    /*code_begin*/
    var SpreadSheetsComponent = /** @class */ (function () {
        function SpreadSheetsComponent(elRef) {
            this.elRef = elRef;
            this.style = {
                width: '800px',
                height: '600px',
            };
            // outputs events
            this.workbookInitialized = new core.EventEmitter();
            this.validationError = new core.EventEmitter();
            this.cellClick = new core.EventEmitter();
            this.cellDoubleClick = new core.EventEmitter();
            this.enterCell = new core.EventEmitter();
            this.leaveCell = new core.EventEmitter();
            this.valueChanged = new core.EventEmitter();
            this.topRowChanged = new core.EventEmitter();
            this.leftColumnChanged = new core.EventEmitter();
            this.invalidOperation = new core.EventEmitter();
            this.rangeFiltering = new core.EventEmitter();
            this.rangeFiltered = new core.EventEmitter();
            this.tableFiltering = new core.EventEmitter();
            this.tableFiltered = new core.EventEmitter();
            this.rangeSorting = new core.EventEmitter();
            this.rangeSorted = new core.EventEmitter();
            this.clipboardChanging = new core.EventEmitter();
            this.clipboardChanged = new core.EventEmitter();
            this.clipboardPasting = new core.EventEmitter();
            this.clipboardPasted = new core.EventEmitter();
            this.columnWidthChanging = new core.EventEmitter();
            this.columnWidthChanged = new core.EventEmitter();
            this.rowHeightChanging = new core.EventEmitter();
            this.rowHeightChanged = new core.EventEmitter();
            this.dragDropBlock = new core.EventEmitter();
            this.dragDropBlockCompleted = new core.EventEmitter();
            this.dragFillBlock = new core.EventEmitter();
            this.dragFillBlockCompleted = new core.EventEmitter();
            this.editStarting = new core.EventEmitter();
            this.editChange = new core.EventEmitter();
            this.editEnding = new core.EventEmitter();
            this.editEnd = new core.EventEmitter();
            this.editEnded = new core.EventEmitter();
            this.rangeGroupStateChanging = new core.EventEmitter();
            this.rangeGroupStateChanged = new core.EventEmitter();
            this.selectionChanging = new core.EventEmitter();
            this.selectionChanged = new core.EventEmitter();
            this.sheetTabClick = new core.EventEmitter();
            this.sheetTabDoubleClick = new core.EventEmitter();
            this.sheetNameChanging = new core.EventEmitter();
            this.sheetNameChanged = new core.EventEmitter();
            this.userZooming = new core.EventEmitter();
            this.userFormulaEntered = new core.EventEmitter();
            this.cellChanged = new core.EventEmitter();
            this.columnChanged = new core.EventEmitter();
            this.rowChanged = new core.EventEmitter();
            this.activeSheetChanging = new core.EventEmitter();
            this.activeSheetChanged = new core.EventEmitter();
            this.sparklineChanged = new core.EventEmitter();
            this.rangeChanged = new core.EventEmitter();
            this.buttonClicked = new core.EventEmitter();
            this.editorStatusChanged = new core.EventEmitter();
            this.floatingObjectChanged = new core.EventEmitter();
            this.floatingObjectSelectionChanged = new core.EventEmitter();
            this.pictureChanged = new core.EventEmitter();
            this.floatingObjectRemoving = new core.EventEmitter();
            this.floatingObjectRemoved = new core.EventEmitter();
            this.pictureSelectionChanged = new core.EventEmitter();
            this.floatingObjectLoaded = new core.EventEmitter();
            this.touchToolStripOpening = new core.EventEmitter();
            this.commentChanged = new core.EventEmitter();
            this.commentRemoving = new core.EventEmitter();
            this.commentRemoved = new core.EventEmitter();
            this.slicerChanged = new core.EventEmitter();
        }
        SpreadSheetsComponent.prototype.ngAfterViewInit = function () {
            var _this = this;
            var elRef = this.elRef;
            var dom = elRef.nativeElement;
            var hostElement = dom.querySelector('div');
            this.spread = new GC.Spread.Sheets.Workbook(hostElement, { sheetCount: 0 });
            this.setSpreadOptions();
            this.initSheets();
            this.sheets.changes.subscribe(function (changes) {
                _this.onSheetsChanged(changes);
            }); // may change sheets using bingidng.
            this.bindCustomEvent(this.spread);
            this.workbookInitialized.emit({ spread: this.spread });
        };
        SpreadSheetsComponent.prototype.onSheetsChanged = function (sheetComponents) {
            var spread = this.spread;
            spread.suspendPaint();
            if (sheetComponents) {
                sheetComponents.forEach(function (sheetComponent, index) {
                    var sheet = sheetComponent.getSheet();
                    if (sheet && !sheet.getParent()) {
                        spread.addSheet(index, sheetComponent.getSheet());
                        sheetComponent.onAttached();
                    }
                });
            }
            spread.resumePaint();
        };
        SpreadSheetsComponent.prototype.initSheets = function () {
            var sheets = this.sheets;
            var spread = this.spread;
            spread.clearSheets();
            sheets.forEach(function (sheetComponent, index) {
                spread.addSheet(index, sheetComponent.getSheet());
                sheetComponent.onAttached();
            });
            // when there is no sheet, add default sheet to spread
            if (sheets.length === 0) {
                spread.addSheet(0, new GC.Spread.Sheets.Worksheet(''));
            }
        };
        SpreadSheetsComponent.prototype.bindCustomEvent = function (spread) {
            var _this = this;
            var customEventNameSpace = '.ng';
            var events = ['ValidationError', 'CellClick', 'CellDoubleClick', 'EnterCell',
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
            events.forEach(function (event) {
                spread.bind(event + customEventNameSpace, function (event, data) {
                    var eventType = event.type;
                    var camelCaseEvent = eventType[0].toLowerCase() + eventType.substr(1);
                    _this[camelCaseEvent].emit(data);
                });
            });
        };
        SpreadSheetsComponent.prototype.setSpreadOptions = function () {
            var spread = this.spread;
            if (!this.spread) {
                return;
            }
            spread.suspendEvent();
            spread.suspendPaint();
            var options = this.spreadOptions;
            options && options.forEach(function (option) {
                if (option.name === 'name') {
                    spread.name = option.value;
                }
                else {
                    spread.options[option.name] = option.value;
                }
            });
            spread.resumePaint();
            spread.resumeEvent();
        };
        SpreadSheetsComponent.prototype.ngOnChanges = function (changes) {
            var options = [];
            for (var changeName in changes) {
                var newValue = changes[changeName].currentValue;
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
        };
        SpreadSheetsComponent.prototype.ngOnDestroy = function () {
            this.spread.destroy();
        };
        return SpreadSheetsComponent;
    }());
    SpreadSheetsComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'gc-spread-sheets',
                    template: "\n        <div [ngStyle]=\"style\" [ngClass]=\"hostClass\">\n            <ng-content></ng-content>\n        </div>\n    "
                },] }
    ];
    SpreadSheetsComponent.ctorParameters = function () { return [
        { type: core.ElementRef }
    ]; };
    SpreadSheetsComponent.propDecorators = {
        allowUserResize: [{ type: core.Input }],
        allowUserZoom: [{ type: core.Input }],
        allowUserEditFormula: [{ type: core.Input }],
        allowUserDragFill: [{ type: core.Input }],
        allowUserDragDrop: [{ type: core.Input }],
        allowUserDragMerge: [{ type: core.Input }],
        allowUndo: [{ type: core.Input }],
        allowSheetReorder: [{ type: core.Input }],
        allowContextMenu: [{ type: core.Input }],
        allowUserDeselect: [{ type: core.Input }],
        allowCopyPasteExcelStyle: [{ type: core.Input }],
        allowExtendPasteRange: [{ type: core.Input }],
        cutCopyIndicatorVisible: [{ type: core.Input }],
        cutCopyIndicatorBorderColor: [{ type: core.Input }],
        copyPasteHeaderOptions: [{ type: core.Input }],
        defaultDragFillType: [{ type: core.Input }],
        enableFormulaTextbox: [{ type: core.Input }],
        highlightInvalidData: [{ type: core.Input }],
        newTabVisible: [{ type: core.Input }],
        tabStripVisible: [{ type: core.Input }],
        tabEditable: [{ type: core.Input }],
        tabStripRatio: [{ type: core.Input }],
        tabNavigationVisible: [{ type: core.Input }],
        autoFitType: [{ type: core.Input }],
        referenceStyle: [{ type: core.Input }],
        backColor: [{ type: core.Input }],
        grayAreaBackColor: [{ type: core.Input }],
        resizeZeroIndicator: [{ type: core.Input }],
        showVerticalScrollbar: [{ type: core.Input }],
        showHorizontalScrollbar: [{ type: core.Input }],
        scrollbarMaxAlign: [{ type: core.Input }],
        scrollIgnoreHidden: [{ type: core.Input }],
        hostStyle: [{ type: core.Input }],
        hostClass: [{ type: core.Input }],
        hideSelection: [{ type: core.Input }],
        name: [{ type: core.Input }],
        backgroundImage: [{ type: core.Input }],
        backgroundImageLayout: [{ type: core.Input }],
        showScrollTip: [{ type: core.Input }],
        showResizeTip: [{ type: core.Input }],
        showDragDropTip: [{ type: core.Input }],
        showDragFillTip: [{ type: core.Input }],
        showDragFillSmartTag: [{ type: core.Input }],
        scrollbarShowMax: [{ type: core.Input }],
        useTouchLayout: [{ type: core.Input }],
        workbookInitialized: [{ type: core.Output }],
        validationError: [{ type: core.Output }],
        cellClick: [{ type: core.Output }],
        cellDoubleClick: [{ type: core.Output }],
        enterCell: [{ type: core.Output }],
        leaveCell: [{ type: core.Output }],
        valueChanged: [{ type: core.Output }],
        topRowChanged: [{ type: core.Output }],
        leftColumnChanged: [{ type: core.Output }],
        invalidOperation: [{ type: core.Output }],
        rangeFiltering: [{ type: core.Output }],
        rangeFiltered: [{ type: core.Output }],
        tableFiltering: [{ type: core.Output }],
        tableFiltered: [{ type: core.Output }],
        rangeSorting: [{ type: core.Output }],
        rangeSorted: [{ type: core.Output }],
        clipboardChanging: [{ type: core.Output }],
        clipboardChanged: [{ type: core.Output }],
        clipboardPasting: [{ type: core.Output }],
        clipboardPasted: [{ type: core.Output }],
        columnWidthChanging: [{ type: core.Output }],
        columnWidthChanged: [{ type: core.Output }],
        rowHeightChanging: [{ type: core.Output }],
        rowHeightChanged: [{ type: core.Output }],
        dragDropBlock: [{ type: core.Output }],
        dragDropBlockCompleted: [{ type: core.Output }],
        dragFillBlock: [{ type: core.Output }],
        dragFillBlockCompleted: [{ type: core.Output }],
        editStarting: [{ type: core.Output }],
        editChange: [{ type: core.Output }],
        editEnding: [{ type: core.Output }],
        editEnd: [{ type: core.Output }],
        editEnded: [{ type: core.Output }],
        rangeGroupStateChanging: [{ type: core.Output }],
        rangeGroupStateChanged: [{ type: core.Output }],
        selectionChanging: [{ type: core.Output }],
        selectionChanged: [{ type: core.Output }],
        sheetTabClick: [{ type: core.Output }],
        sheetTabDoubleClick: [{ type: core.Output }],
        sheetNameChanging: [{ type: core.Output }],
        sheetNameChanged: [{ type: core.Output }],
        userZooming: [{ type: core.Output }],
        userFormulaEntered: [{ type: core.Output }],
        cellChanged: [{ type: core.Output }],
        columnChanged: [{ type: core.Output }],
        rowChanged: [{ type: core.Output }],
        activeSheetChanging: [{ type: core.Output }],
        activeSheetChanged: [{ type: core.Output }],
        sparklineChanged: [{ type: core.Output }],
        rangeChanged: [{ type: core.Output }],
        buttonClicked: [{ type: core.Output }],
        editorStatusChanged: [{ type: core.Output }],
        floatingObjectChanged: [{ type: core.Output }],
        floatingObjectSelectionChanged: [{ type: core.Output }],
        pictureChanged: [{ type: core.Output }],
        floatingObjectRemoving: [{ type: core.Output }],
        floatingObjectRemoved: [{ type: core.Output }],
        pictureSelectionChanged: [{ type: core.Output }],
        floatingObjectLoaded: [{ type: core.Output }],
        touchToolStripOpening: [{ type: core.Output }],
        commentChanged: [{ type: core.Output }],
        commentRemoving: [{ type: core.Output }],
        commentRemoved: [{ type: core.Output }],
        slicerChanged: [{ type: core.Output }],
        sheets: [{ type: core.ContentChildren, args: [WorksheetComponent,] }]
    };
    /*code_end*/

    /*import_begin*/
    /*code_begin*/
    var SpreadSheetsModule = /** @class */ (function () {
        function SpreadSheetsModule() {
        }
        return SpreadSheetsModule;
    }());
    SpreadSheetsModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule],
                    declarations: [SpreadSheetsComponent, WorksheetComponent, ColumnComponent],
                    exports: [SpreadSheetsComponent, WorksheetComponent, ColumnComponent],
                },] }
    ];
    /*code_end*/

    /**
     * Generated bundle index. Do not edit.
     */

    exports.SpreadSheetsModule = SpreadSheetsModule;
    exports.ɵa = SpreadSheetsComponent;
    exports.ɵb = WorksheetComponent;
    exports.ɵc = ColumnComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=grapecity-spread-sheets-angular.umd.js.map

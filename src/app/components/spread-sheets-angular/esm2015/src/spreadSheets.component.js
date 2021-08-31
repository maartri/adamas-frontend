/*import_begin*/
import { Component, ContentChildren, ElementRef, EventEmitter, Input, Output, } from '@angular/core';
/*import_end*/
import { WorksheetComponent } from './worksheet.component';
import * as GC from '@grapecity/spread-sheets';
/*code_begin*/
export class SpreadSheetsComponent {
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
        this.spread = new GC.Spread.Sheets.Workbook(hostElement, { sheetCount: 0 });
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
            spread.addSheet(0, new GC.Spread.Sheets.Worksheet(''));
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
SpreadSheetsComponent.decorators = [
    { type: Component, args: [{
                selector: 'gc-spread-sheets',
                template: `
        <div [ngStyle]="style" [ngClass]="hostClass">
            <ng-content></ng-content>
        </div>
    `
            },] }
];
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
/*code_end*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ByZWFkU2hlZXRzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zcHJlYWRTaGVldHMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdCQUFnQjtBQUNoQixPQUFPLEVBRUwsU0FBUyxFQUNULGVBQWUsRUFDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEdBRVAsTUFBTSxlQUFlLENBQUM7QUFDdkIsY0FBYztBQUVkLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzNELE9BQU8sS0FBSyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDL0MsY0FBYztBQVNkLE1BQU0sT0FBTyxxQkFBcUI7SUE2SGhDLFlBQW9CLEtBQWlCO1FBQWpCLFVBQUssR0FBTCxLQUFLLENBQVk7UUF6SDlCLFVBQUssR0FBRztZQUNiLEtBQUssRUFBRSxPQUFPO1lBQ2QsTUFBTSxFQUFFLE9BQU87U0FDaEIsQ0FBQztRQWlERixpQkFBaUI7UUFDQSx3QkFBbUIsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQzlDLG9CQUFlLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUMxQyxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUNwQyxvQkFBZSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDMUMsY0FBUyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDcEMsY0FBUyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDcEMsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ3ZDLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUN4QyxzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQzVDLHFCQUFnQixHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDM0MsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFD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NEJBQ0wsS0FBSzs0QkFDTCxLQUFLOzhCQUNMLEtBQUs7OEJBQ0wsS0FBSzttQ0FDTCxLQUFLOytCQUNMLEtBQUs7NkJBQ0wsS0FBSztrQ0FHTCxNQUFNOzhCQUNOLE1BQU07d0JBQ04sTUFBTTs4QkFDTixNQUFNO3dCQUNOLE1BQU07d0JBQ04sTUFBTTsyQkFDTixNQUFNOzRCQUNOLE1BQU07Z0NBQ04sTUFBTTsrQkFDTixNQUFNOzZCQUNOLE1BQU07NEJBQ04sTUFBTTs2QkFDTixNQUFNOzRCQUNOLE1BQU07MkJBQ04sTUFBTTswQkFDTixNQUFNO2dDQUNOLE1BQU07K0JBQ04sTUFBTTsrQkFDTixNQUFNOzhCQUNOLE1BQU07a0NBQ04sTUFBTTtpQ0FDTixNQUFNO2dDQUNOLE1BQU07K0JBQ04sTUFBTTs0QkFDTixNQUFNO3FDQUNOLE1BQU07NEJBQ04sTUFBTTtxQ0FDTixNQUFNOzJCQUNOLE1BQU07eUJBQ04sTUFBTTt5QkFDTixNQUFNO3NCQUNOLE1BQU07d0JBQ04sTUFBTTtzQ0FDTixNQUFNO3FDQUNOLE1BQU07Z0NBQ04sTUFBTTsrQkFDTixNQUFNOzRCQUNOLE1BQU07a0NBQ04sTUFBTTtnQ0FDTixNQUFNOytCQUNOLE1BQU07MEJBQ04sTUFBTTtpQ0FDTixNQUFNOzBCQUNOLE1BQU07NEJBQ04sTUFBTTt5QkFDTixNQUFNO2tDQUNOLE1BQU07aUNBQ04sTUFBTTsrQkFDTixNQUFNOzJCQUNOLE1BQU07NEJBQ04sTUFBTTtrQ0FDTixNQUFNO29DQUNOLE1BQU07NkNBQ04sTUFBTTs2QkFDTixNQUFNO3FDQUNOLE1BQU07b0NBQ04sTUFBTTtzQ0FDTixNQUFNO21DQUNOLE1BQU07b0NBQ04sTUFBTTs2QkFDTixNQUFNOzhCQUNOLE1BQU07NkJBQ04sTUFBTTs0QkFDTixNQUFNO3FCQUVOLGVBQWUsU0FBQyxrQkFBa0I7O0FBd0hyQyxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiLyppbXBvcnRfYmVnaW4qL1xyXG5pbXBvcnQge1xyXG4gIEFmdGVyVmlld0luaXQsXHJcbiAgQ29tcG9uZW50LFxyXG4gIENvbnRlbnRDaGlsZHJlbixcclxuICBFbGVtZW50UmVmLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBJbnB1dCxcclxuICBPbkNoYW5nZXMsXHJcbiAgT25EZXN0cm95LFxyXG4gIE91dHB1dCxcclxuICBRdWVyeUxpc3QsIFNpbXBsZUNoYW5nZXMsXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbi8qaW1wb3J0X2VuZCovXHJcblxyXG5pbXBvcnQgeyBXb3Jrc2hlZXRDb21wb25lbnQgfSBmcm9tICcuL3dvcmtzaGVldC5jb21wb25lbnQnO1xyXG5pbXBvcnQgKiBhcyBHQyBmcm9tICdAZ3JhcGVjaXR5L3NwcmVhZC1zaGVldHMnO1xyXG4vKmNvZGVfYmVnaW4qL1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2djLXNwcmVhZC1zaGVldHMnLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICAgICAgPGRpdiBbbmdTdHlsZV09XCJzdHlsZVwiIFtuZ0NsYXNzXT1cImhvc3RDbGFzc1wiPlxyXG4gICAgICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICBgLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgU3ByZWFkU2hlZXRzQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xyXG4gIHByaXZhdGUgc3ByZWFkPzogR0MuU3ByZWFkLlNoZWV0cy5Xb3JrYm9vaztcclxuICBwcml2YXRlIHNwcmVhZE9wdGlvbnM/OiBhbnlbXTtcclxuXHJcbiAgcHVibGljIHN0eWxlID0ge1xyXG4gICAgd2lkdGg6ICc4MDBweCcsXHJcbiAgICBoZWlnaHQ6ICc2MDBweCcsXHJcbiAgfTtcclxuXHJcbiAgLy8gaW5kaWNhdGUgYWxsIG9wdGlvbnNcclxuICBASW5wdXQoKSBwdWJsaWMgYWxsb3dVc2VyUmVzaXplPzogYm9vbGVhbjtcclxuICBASW5wdXQoKSBwdWJsaWMgYWxsb3dVc2VyWm9vbT86IGJvb2xlYW47XHJcbiAgQElucHV0KCkgcHVibGljIGFsbG93VXNlckVkaXRGb3JtdWxhPzogYm9vbGVhbjtcclxuICBASW5wdXQoKSBwdWJsaWMgYWxsb3dVc2VyRHJhZ0ZpbGw/OiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBhbGxvd1VzZXJEcmFnRHJvcD86IGJvb2xlYW47XHJcbiAgQElucHV0KCkgcHVibGljIGFsbG93VXNlckRyYWdNZXJnZT86IGJvb2xlYW47XHJcbiAgQElucHV0KCkgcHVibGljIGFsbG93VW5kbz86IGJvb2xlYW47XHJcbiAgQElucHV0KCkgcHVibGljIGFsbG93U2hlZXRSZW9yZGVyPzogYm9vbGVhbjtcclxuICBASW5wdXQoKSBwdWJsaWMgYWxsb3dDb250ZXh0TWVudT86IGJvb2xlYW47XHJcbiAgQElucHV0KCkgcHVibGljIGFsbG93VXNlckRlc2VsZWN0PzogYm9vbGVhbjtcclxuICBASW5wdXQoKSBwdWJsaWMgYWxsb3dDb3B5UGFzdGVFeGNlbFN0eWxlPzogYm9vbGVhbjtcclxuICBASW5wdXQoKSBwdWJsaWMgYWxsb3dFeHRlbmRQYXN0ZVJhbmdlPzogYm9vbGVhbjtcclxuICBASW5wdXQoKSBwdWJsaWMgY3V0Q29weUluZGljYXRvclZpc2libGU/OiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBjdXRDb3B5SW5kaWNhdG9yQm9yZGVyQ29sb3I/OiBzdHJpbmc7XHJcbiAgQElucHV0KCkgcHVibGljIGNvcHlQYXN0ZUhlYWRlck9wdGlvbnM/OiBudW1iZXI7XHJcbiAgQElucHV0KCkgcHVibGljIGRlZmF1bHREcmFnRmlsbFR5cGU/OiBudW1iZXI7XHJcbiAgQElucHV0KCkgcHVibGljIGVuYWJsZUZvcm11bGFUZXh0Ym94PzogYm9vbGVhbjtcclxuICBASW5wdXQoKSBwdWJsaWMgaGlnaGxpZ2h0SW52YWxpZERhdGE/OiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBuZXdUYWJWaXNpYmxlPzogYm9vbGVhbjtcclxuICBASW5wdXQoKSBwdWJsaWMgdGFiU3RyaXBWaXNpYmxlPzogYm9vbGVhbjtcclxuICBASW5wdXQoKSBwdWJsaWMgdGFiRWRpdGFibGU/OiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyB0YWJTdHJpcFJhdGlvPzogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyB0YWJOYXZpZ2F0aW9uVmlzaWJsZT86IGJvb2xlYW47XHJcbiAgQElucHV0KCkgcHVibGljIGF1dG9GaXRUeXBlPzogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyByZWZlcmVuY2VTdHlsZT86IG51bWJlcjtcclxuICBASW5wdXQoKSBwdWJsaWMgYmFja0NvbG9yPzogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBncmF5QXJlYUJhY2tDb2xvcj86IHN0cmluZztcclxuICBASW5wdXQoKSBwdWJsaWMgcmVzaXplWmVyb0luZGljYXRvcj86IG51bWJlcjtcclxuICBASW5wdXQoKSBwdWJsaWMgc2hvd1ZlcnRpY2FsU2Nyb2xsYmFyPzogYm9vbGVhbjtcclxuICBASW5wdXQoKSBwdWJsaWMgc2hvd0hvcml6b250YWxTY3JvbGxiYXI/OiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBzY3JvbGxiYXJNYXhBbGlnbj86IGJvb2xlYW47XHJcbiAgQElucHV0KCkgcHVibGljIHNjcm9sbElnbm9yZUhpZGRlbj86IGJvb2xlYW47XHJcbiAgQElucHV0KCkgcHVibGljIGhvc3RTdHlsZT86IGFueTsgLy8gdXNlZCBmb3IgZ2V0IHN0eWxlcyBmb3JtIHBhcmVudCBob3N0IERJVlxyXG4gIEBJbnB1dCgpIHB1YmxpYyBob3N0Q2xhc3M/OiBzdHJpbmc7XHJcbiAgQElucHV0KCkgcHVibGljIGhpZGVTZWxlY3Rpb24/OiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBuYW1lPzogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBiYWNrZ3JvdW5kSW1hZ2U/OiBzdHJpbmc7XHJcbiAgQElucHV0KCkgcHVibGljIGJhY2tncm91bmRJbWFnZUxheW91dD86IG51bWJlcjtcclxuICBASW5wdXQoKSBwdWJsaWMgc2hvd1Njcm9sbFRpcD86IG51bWJlcjtcclxuICBASW5wdXQoKSBwdWJsaWMgc2hvd1Jlc2l6ZVRpcD86IG51bWJlcjtcclxuICBASW5wdXQoKSBwdWJsaWMgc2hvd0RyYWdEcm9wVGlwPzogYm9vbGVhbjtcclxuICBASW5wdXQoKSBwdWJsaWMgc2hvd0RyYWdGaWxsVGlwPzogYm9vbGVhbjtcclxuICBASW5wdXQoKSBwdWJsaWMgc2hvd0RyYWdGaWxsU21hcnRUYWc/OiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBzY3JvbGxiYXJTaG93TWF4PzogYm9vbGVhbjtcclxuICBASW5wdXQoKSBwdWJsaWMgdXNlVG91Y2hMYXlvdXQ/OiBib29sZWFuO1xyXG5cclxuICAvLyBvdXRwdXRzIGV2ZW50c1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgd29ya2Jvb2tJbml0aWFsaXplZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgdmFsaWRhdGlvbkVycm9yID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyBjZWxsQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuICBAT3V0cHV0KCkgcHVibGljIGNlbGxEb3VibGVDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgZW50ZXJDZWxsID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyBsZWF2ZUNlbGwgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuICBAT3V0cHV0KCkgcHVibGljIHZhbHVlQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgdG9wUm93Q2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgbGVmdENvbHVtbkNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuICBAT3V0cHV0KCkgcHVibGljIGludmFsaWRPcGVyYXRpb24gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuICBAT3V0cHV0KCkgcHVibGljIHJhbmdlRmlsdGVyaW5nID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyByYW5nZUZpbHRlcmVkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyB0YWJsZUZpbHRlcmluZyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgdGFibGVGaWx0ZXJlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgcmFuZ2VTb3J0aW5nID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyByYW5nZVNvcnRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgY2xpcGJvYXJkQ2hhbmdpbmcgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuICBAT3V0cHV0KCkgcHVibGljIGNsaXBib2FyZENoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuICBAT3V0cHV0KCkgcHVibGljIGNsaXBib2FyZFBhc3RpbmcgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuICBAT3V0cHV0KCkgcHVibGljIGNsaXBib2FyZFBhc3RlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgY29sdW1uV2lkdGhDaGFuZ2luZyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgY29sdW1uV2lkdGhDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyByb3dIZWlnaHRDaGFuZ2luZyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgcm93SGVpZ2h0Q2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgZHJhZ0Ryb3BCbG9jayA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgZHJhZ0Ryb3BCbG9ja0NvbXBsZXRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgZHJhZ0ZpbGxCbG9jayA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgZHJhZ0ZpbGxCbG9ja0NvbXBsZXRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgZWRpdFN0YXJ0aW5nID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyBlZGl0Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyBlZGl0RW5kaW5nID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyBlZGl0RW5kID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyBlZGl0RW5kZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuICBAT3V0cHV0KCkgcHVibGljIHJhbmdlR3JvdXBTdGF0ZUNoYW5naW5nID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyByYW5nZUdyb3VwU3RhdGVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyBzZWxlY3Rpb25DaGFuZ2luZyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgc2VsZWN0aW9uQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgc2hlZXRUYWJDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgc2hlZXRUYWJEb3VibGVDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgc2hlZXROYW1lQ2hhbmdpbmcgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuICBAT3V0cHV0KCkgcHVibGljIHNoZWV0TmFtZUNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuICBAT3V0cHV0KCkgcHVibGljIHVzZXJab29taW5nID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyB1c2VyRm9ybXVsYUVudGVyZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuICBAT3V0cHV0KCkgcHVibGljIGNlbGxDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyBjb2x1bW5DaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyByb3dDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyBhY3RpdmVTaGVldENoYW5naW5nID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyBhY3RpdmVTaGVldENoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuICBAT3V0cHV0KCkgcHVibGljIHNwYXJrbGluZUNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuICBAT3V0cHV0KCkgcHVibGljIHJhbmdlQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgYnV0dG9uQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgZWRpdG9yU3RhdHVzQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgZmxvYXRpbmdPYmplY3RDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyBmbG9hdGluZ09iamVjdFNlbGVjdGlvbkNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuICBAT3V0cHV0KCkgcHVibGljIHBpY3R1cmVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyBmbG9hdGluZ09iamVjdFJlbW92aW5nID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyBmbG9hdGluZ09iamVjdFJlbW92ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuICBAT3V0cHV0KCkgcHVibGljIHBpY3R1cmVTZWxlY3Rpb25DaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyBmbG9hdGluZ09iamVjdExvYWRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgdG91Y2hUb29sU3RyaXBPcGVuaW5nID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyBjb21tZW50Q2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgY29tbWVudFJlbW92aW5nID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyBjb21tZW50UmVtb3ZlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgc2xpY2VyQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG5cclxuICBAQ29udGVudENoaWxkcmVuKFdvcmtzaGVldENvbXBvbmVudClcclxuICBwdWJsaWMgc2hlZXRzPzogUXVlcnlMaXN0PFdvcmtzaGVldENvbXBvbmVudD47XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxSZWY6IEVsZW1lbnRSZWYpIHtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICBjb25zdCBlbFJlZiA9IHRoaXMuZWxSZWY7XHJcbiAgICBjb25zdCBkb20gPSBlbFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xyXG4gICAgY29uc3QgaG9zdEVsZW1lbnQgPSBkb20ucXVlcnlTZWxlY3RvcignZGl2Jyk7XHJcbiAgICB0aGlzLnNwcmVhZCA9IG5ldyBHQy5TcHJlYWQuU2hlZXRzLldvcmtib29rKGhvc3RFbGVtZW50LCB7IHNoZWV0Q291bnQ6IDAgfSk7XHJcbiAgICB0aGlzLnNldFNwcmVhZE9wdGlvbnMoKTtcclxuICAgIHRoaXMuaW5pdFNoZWV0cygpO1xyXG4gICAgKHRoaXMuc2hlZXRzIGFzIFF1ZXJ5TGlzdDxXb3Jrc2hlZXRDb21wb25lbnQ+KS5jaGFuZ2VzLnN1YnNjcmliZSgoY2hhbmdlcykgPT4ge1xyXG4gICAgICB0aGlzLm9uU2hlZXRzQ2hhbmdlZChjaGFuZ2VzKTtcclxuICAgIH0pOyAvLyBtYXkgY2hhbmdlIHNoZWV0cyB1c2luZyBiaW5naWRuZy5cclxuICAgIHRoaXMuYmluZEN1c3RvbUV2ZW50KHRoaXMuc3ByZWFkKTtcclxuICAgIHRoaXMud29ya2Jvb2tJbml0aWFsaXplZC5lbWl0KHsgc3ByZWFkOiB0aGlzLnNwcmVhZCB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25TaGVldHNDaGFuZ2VkKHNoZWV0Q29tcG9uZW50czogUXVlcnlMaXN0PFdvcmtzaGVldENvbXBvbmVudD4pIHtcclxuICAgIGNvbnN0IHNwcmVhZCA9ICh0aGlzLnNwcmVhZCBhcyBHQy5TcHJlYWQuU2hlZXRzLldvcmtib29rKTtcclxuICAgIHNwcmVhZC5zdXNwZW5kUGFpbnQoKTtcclxuICAgIGlmIChzaGVldENvbXBvbmVudHMpIHtcclxuICAgICAgc2hlZXRDb21wb25lbnRzLmZvckVhY2goKHNoZWV0Q29tcG9uZW50OiBXb3Jrc2hlZXRDb21wb25lbnQsIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICBjb25zdCBzaGVldCA9IHNoZWV0Q29tcG9uZW50LmdldFNoZWV0KCk7XHJcbiAgICAgICAgaWYgKHNoZWV0ICYmICFzaGVldC5nZXRQYXJlbnQoKSkge1xyXG4gICAgICAgICAgc3ByZWFkLmFkZFNoZWV0KGluZGV4LCBzaGVldENvbXBvbmVudC5nZXRTaGVldCgpKTtcclxuICAgICAgICAgIHNoZWV0Q29tcG9uZW50Lm9uQXR0YWNoZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3ByZWFkLnJlc3VtZVBhaW50KCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXRTaGVldHMoKSB7XHJcbiAgICBjb25zdCBzaGVldHMgPSB0aGlzLnNoZWV0cyBhcyBRdWVyeUxpc3Q8V29ya3NoZWV0Q29tcG9uZW50PjtcclxuICAgIGNvbnN0IHNwcmVhZCA9IHRoaXMuc3ByZWFkIGFzIEdDLlNwcmVhZC5TaGVldHMuV29ya2Jvb2s7XHJcbiAgICBzcHJlYWQuY2xlYXJTaGVldHMoKTtcclxuICAgIHNoZWV0cy5mb3JFYWNoKChzaGVldENvbXBvbmVudCwgaW5kZXgpID0+IHtcclxuICAgICAgc3ByZWFkLmFkZFNoZWV0KGluZGV4LCBzaGVldENvbXBvbmVudC5nZXRTaGVldCgpKTtcclxuICAgICAgc2hlZXRDb21wb25lbnQub25BdHRhY2hlZCgpO1xyXG4gICAgfSk7XHJcbiAgICAvLyB3aGVuIHRoZXJlIGlzIG5vIHNoZWV0LCBhZGQgZGVmYXVsdCBzaGVldCB0byBzcHJlYWRcclxuICAgIGlmIChzaGVldHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHNwcmVhZC5hZGRTaGVldCgwLCBuZXcgR0MuU3ByZWFkLlNoZWV0cy5Xb3Jrc2hlZXQoJycpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYmluZEN1c3RvbUV2ZW50KHNwcmVhZDogR0MuU3ByZWFkLlNoZWV0cy5Xb3JrYm9vaykge1xyXG4gICAgY29uc3QgY3VzdG9tRXZlbnROYW1lU3BhY2UgPSAnLm5nJztcclxuICAgIGNvbnN0IGV2ZW50cyA9IFsnVmFsaWRhdGlvbkVycm9yJywgJ0NlbGxDbGljaycsICdDZWxsRG91YmxlQ2xpY2snLCAnRW50ZXJDZWxsJyxcclxuICAgICAgJ0xlYXZlQ2VsbCcsICdWYWx1ZUNoYW5nZWQnLCAnVG9wUm93Q2hhbmdlZCcsICdMZWZ0Q29sdW1uQ2hhbmdlZCcsXHJcbiAgICAgICdJbnZhbGlkT3BlcmF0aW9uJywgJ1JhbmdlRmlsdGVyaW5nJywgJ1JhbmdlRmlsdGVyZWQnLCAnVGFibGVGaWx0ZXJpbmcnLFxyXG4gICAgICAnVGFibGVGaWx0ZXJlZCcsICdSYW5nZVNvcnRpbmcnLCAnUmFuZ2VTb3J0ZWQnLCAnQ2xpcGJvYXJkQ2hhbmdpbmcnLFxyXG4gICAgICAnQ2xpcGJvYXJkQ2hhbmdlZCcsICdDbGlwYm9hcmRQYXN0aW5nJywgJ0NsaXBib2FyZFBhc3RlZCcsICdDb2x1bW5XaWR0aENoYW5naW5nJyxcclxuICAgICAgJ0NvbHVtbldpZHRoQ2hhbmdlZCcsICdSb3dIZWlnaHRDaGFuZ2luZycsICdSb3dIZWlnaHRDaGFuZ2VkJywgJ0RyYWdEcm9wQmxvY2snLFxyXG4gICAgICAnRHJhZ0Ryb3BCbG9ja0NvbXBsZXRlZCcsICdEcmFnRmlsbEJsb2NrJywgJ0RyYWdGaWxsQmxvY2tDb21wbGV0ZWQnLCAnRWRpdFN0YXJ0aW5nJyxcclxuICAgICAgJ0VkaXRDaGFuZ2UnLCAnRWRpdEVuZGluZycsICdFZGl0RW5kJywgJ0VkaXRFbmRlZCcsICdSYW5nZUdyb3VwU3RhdGVDaGFuZ2luZycsXHJcbiAgICAgICdSYW5nZUdyb3VwU3RhdGVDaGFuZ2VkJywgJ1NlbGVjdGlvbkNoYW5naW5nJywgJ1NlbGVjdGlvbkNoYW5nZWQnLCAnU2hlZXRUYWJDbGljaycsXHJcbiAgICAgICdTaGVldFRhYkRvdWJsZUNsaWNrJywgJ1NoZWV0TmFtZUNoYW5naW5nJywgJ1NoZWV0TmFtZUNoYW5nZWQnLFxyXG4gICAgICAnVXNlclpvb21pbmcnLCAnVXNlckZvcm11bGFFbnRlcmVkJywgJ0NlbGxDaGFuZ2VkJywgJ0NvbHVtbkNoYW5nZWQnLFxyXG4gICAgICAnUm93Q2hhbmdlZCcsICdBY3RpdmVTaGVldENoYW5naW5nJywgJ0FjdGl2ZVNoZWV0Q2hhbmdlZCcsXHJcbiAgICAgICdTcGFya2xpbmVDaGFuZ2VkJyxcclxuICAgICAgJ1JhbmdlQ2hhbmdlZCcsICdCdXR0b25DbGlja2VkJywgJ0VkaXRvclN0YXR1c0NoYW5nZWQnLFxyXG4gICAgICAnRmxvYXRpbmdPYmplY3RDaGFuZ2VkJywgJ0Zsb2F0aW5nT2JqZWN0U2VsZWN0aW9uQ2hhbmdlZCcsICdQaWN0dXJlQ2hhbmdlZCcsXHJcbiAgICAgICdGbG9hdGluZ09iamVjdFJlbW92aW5nJywgJ0Zsb2F0aW5nT2JqZWN0UmVtb3ZlZCcsICdQaWN0dXJlU2VsZWN0aW9uQ2hhbmdlZCcsXHJcbiAgICAgICdGbG9hdGluZ09iamVjdExvYWRlZCcsICdUb3VjaFRvb2xTdHJpcE9wZW5pbmcnLCAnQ29tbWVudENoYW5nZWQnLCAnQ29tbWVudFJlbW92aW5nJywgJ0NvbW1lbnRSZW1vdmVkJywgJ1NsaWNlckNoYW5nZWQnXTtcclxuICAgIGV2ZW50cy5mb3JFYWNoKChldmVudCkgPT4ge1xyXG4gICAgICBzcHJlYWQuYmluZChldmVudCArIGN1c3RvbUV2ZW50TmFtZVNwYWNlLCAoZXZlbnQ6IGFueSwgZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgY29uc3QgZXZlbnRUeXBlID0gZXZlbnQudHlwZTtcclxuICAgICAgICBjb25zdCBjYW1lbENhc2VFdmVudCA9IGV2ZW50VHlwZVswXS50b0xvd2VyQ2FzZSgpICsgZXZlbnRUeXBlLnN1YnN0cigxKTtcclxuICAgICAgICAodGhpcyBhcyBhbnkpW2NhbWVsQ2FzZUV2ZW50XS5lbWl0KGRhdGEpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNldFNwcmVhZE9wdGlvbnMoKSB7XHJcbiAgICBjb25zdCBzcHJlYWQgPSB0aGlzLnNwcmVhZCBhcyBHQy5TcHJlYWQuU2hlZXRzLldvcmtib29rO1xyXG4gICAgaWYgKCF0aGlzLnNwcmVhZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBzcHJlYWQuc3VzcGVuZEV2ZW50KCk7XHJcbiAgICBzcHJlYWQuc3VzcGVuZFBhaW50KCk7XHJcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5zcHJlYWRPcHRpb25zO1xyXG4gICAgb3B0aW9ucyAmJiBvcHRpb25zLmZvckVhY2goKG9wdGlvbikgPT4ge1xyXG4gICAgICBpZiAob3B0aW9uLm5hbWUgPT09ICduYW1lJykge1xyXG4gICAgICAgIHNwcmVhZC5uYW1lID0gb3B0aW9uLnZhbHVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIChzcHJlYWQub3B0aW9ucyBhcyBhbnkpW29wdGlvbi5uYW1lXSA9IG9wdGlvbi52YWx1ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBzcHJlYWQucmVzdW1lUGFpbnQoKTtcclxuICAgIHNwcmVhZC5yZXN1bWVFdmVudCgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSBbXTtcclxuICAgIGZvciAoY29uc3QgY2hhbmdlTmFtZSBpbiBjaGFuZ2VzKSB7XHJcbiAgICAgIGNvbnN0IG5ld1ZhbHVlID0gY2hhbmdlc1tjaGFuZ2VOYW1lXS5jdXJyZW50VmFsdWU7XHJcbiAgICAgIGlmIChuZXdWYWx1ZSAhPT0gbnVsbCAmJiBuZXdWYWx1ZSAhPT0gdm9pZCAwKSB7XHJcbiAgICAgICAgc3dpdGNoIChjaGFuZ2VOYW1lKSB7XHJcbiAgICAgICAgICBjYXNlICdob3N0U3R5bGUnOlxyXG4gICAgICAgICAgICB0aGlzLnN0eWxlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSAnaG9zdENsYXNzJzpcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBvcHRpb25zLnB1c2goeyBuYW1lOiBjaGFuZ2VOYW1lLCB2YWx1ZTogbmV3VmFsdWUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnNwcmVhZE9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgdGhpcy5zZXRTcHJlYWRPcHRpb25zKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICAodGhpcy5zcHJlYWQgYXMgR0MuU3ByZWFkLlNoZWV0cy5Xb3JrYm9vaykuZGVzdHJveSgpO1xyXG4gIH1cclxufVxyXG4vKmNvZGVfZW5kKi9cclxuIl19
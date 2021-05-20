import { AfterViewInit, ElementRef, EventEmitter, OnChanges, OnDestroy, QueryList, SimpleChanges } from '@angular/core';
import { WorksheetComponent } from './worksheet.component';
import * as ɵngcc0 from '@angular/core';
export declare class SpreadSheetsComponent implements OnChanges, AfterViewInit, OnDestroy {
    private elRef;
    private spread?;
    private spreadOptions?;
    style: {
        width: string;
        height: string;
    };
    allowUserResize?: boolean;
    allowUserZoom?: boolean;
    allowUserEditFormula?: boolean;
    allowUserDragFill?: boolean;
    allowUserDragDrop?: boolean;
    allowUserDragMerge?: boolean;
    allowUndo?: boolean;
    allowSheetReorder?: boolean;
    allowContextMenu?: boolean;
    allowUserDeselect?: boolean;
    allowCopyPasteExcelStyle?: boolean;
    allowExtendPasteRange?: boolean;
    cutCopyIndicatorVisible?: boolean;
    cutCopyIndicatorBorderColor?: string;
    copyPasteHeaderOptions?: number;
    defaultDragFillType?: number;
    enableFormulaTextbox?: boolean;
    highlightInvalidData?: boolean;
    newTabVisible?: boolean;
    tabStripVisible?: boolean;
    tabEditable?: boolean;
    tabStripRatio?: number;
    tabNavigationVisible?: boolean;
    autoFitType?: number;
    referenceStyle?: number;
    backColor?: string;
    grayAreaBackColor?: string;
    resizeZeroIndicator?: number;
    showVerticalScrollbar?: boolean;
    showHorizontalScrollbar?: boolean;
    scrollbarMaxAlign?: boolean;
    scrollIgnoreHidden?: boolean;
    hostStyle?: any;
    hostClass?: string;
    hideSelection?: boolean;
    name?: string;
    backgroundImage?: string;
    backgroundImageLayout?: number;
    showScrollTip?: number;
    showResizeTip?: number;
    showDragDropTip?: boolean;
    showDragFillTip?: boolean;
    showDragFillSmartTag?: boolean;
    scrollbarShowMax?: boolean;
    useTouchLayout?: boolean;
    workbookInitialized: EventEmitter<any>;
    validationError: EventEmitter<any>;
    cellClick: EventEmitter<any>;
    cellDoubleClick: EventEmitter<any>;
    enterCell: EventEmitter<any>;
    leaveCell: EventEmitter<any>;
    valueChanged: EventEmitter<any>;
    topRowChanged: EventEmitter<any>;
    leftColumnChanged: EventEmitter<any>;
    invalidOperation: EventEmitter<any>;
    rangeFiltering: EventEmitter<any>;
    rangeFiltered: EventEmitter<any>;
    tableFiltering: EventEmitter<any>;
    tableFiltered: EventEmitter<any>;
    rangeSorting: EventEmitter<any>;
    rangeSorted: EventEmitter<any>;
    clipboardChanging: EventEmitter<any>;
    clipboardChanged: EventEmitter<any>;
    clipboardPasting: EventEmitter<any>;
    clipboardPasted: EventEmitter<any>;
    columnWidthChanging: EventEmitter<any>;
    columnWidthChanged: EventEmitter<any>;
    rowHeightChanging: EventEmitter<any>;
    rowHeightChanged: EventEmitter<any>;
    dragDropBlock: EventEmitter<any>;
    dragDropBlockCompleted: EventEmitter<any>;
    dragFillBlock: EventEmitter<any>;
    dragFillBlockCompleted: EventEmitter<any>;
    editStarting: EventEmitter<any>;
    editChange: EventEmitter<any>;
    editEnding: EventEmitter<any>;
    editEnd: EventEmitter<any>;
    editEnded: EventEmitter<any>;
    rangeGroupStateChanging: EventEmitter<any>;
    rangeGroupStateChanged: EventEmitter<any>;
    selectionChanging: EventEmitter<any>;
    selectionChanged: EventEmitter<any>;
    sheetTabClick: EventEmitter<any>;
    sheetTabDoubleClick: EventEmitter<any>;
    sheetNameChanging: EventEmitter<any>;
    sheetNameChanged: EventEmitter<any>;
    userZooming: EventEmitter<any>;
    userFormulaEntered: EventEmitter<any>;
    cellChanged: EventEmitter<any>;
    columnChanged: EventEmitter<any>;
    rowChanged: EventEmitter<any>;
    activeSheetChanging: EventEmitter<any>;
    activeSheetChanged: EventEmitter<any>;
    sparklineChanged: EventEmitter<any>;
    rangeChanged: EventEmitter<any>;
    buttonClicked: EventEmitter<any>;
    editorStatusChanged: EventEmitter<any>;
    floatingObjectChanged: EventEmitter<any>;
    floatingObjectSelectionChanged: EventEmitter<any>;
    pictureChanged: EventEmitter<any>;
    floatingObjectRemoving: EventEmitter<any>;
    floatingObjectRemoved: EventEmitter<any>;
    pictureSelectionChanged: EventEmitter<any>;
    floatingObjectLoaded: EventEmitter<any>;
    touchToolStripOpening: EventEmitter<any>;
    commentChanged: EventEmitter<any>;
    commentRemoving: EventEmitter<any>;
    commentRemoved: EventEmitter<any>;
    slicerChanged: EventEmitter<any>;
    sheets?: QueryList<WorksheetComponent>;
    constructor(elRef: ElementRef);
    ngAfterViewInit(): void;
    private onSheetsChanged;
    private initSheets;
    private bindCustomEvent;
    setSpreadOptions(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<SpreadSheetsComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<SpreadSheetsComponent, "gc-spread-sheets", never, { "allowUserResize": "allowUserResize"; "allowUserZoom": "allowUserZoom"; "allowUserEditFormula": "allowUserEditFormula"; "allowUserDragFill": "allowUserDragFill"; "allowUserDragDrop": "allowUserDragDrop"; "allowUserDragMerge": "allowUserDragMerge"; "allowUndo": "allowUndo"; "allowSheetReorder": "allowSheetReorder"; "allowContextMenu": "allowContextMenu"; "allowUserDeselect": "allowUserDeselect"; "allowCopyPasteExcelStyle": "allowCopyPasteExcelStyle"; "allowExtendPasteRange": "allowExtendPasteRange"; "cutCopyIndicatorVisible": "cutCopyIndicatorVisible"; "cutCopyIndicatorBorderColor": "cutCopyIndicatorBorderColor"; "copyPasteHeaderOptions": "copyPasteHeaderOptions"; "defaultDragFillType": "defaultDragFillType"; "enableFormulaTextbox": "enableFormulaTextbox"; "highlightInvalidData": "highlightInvalidData"; "newTabVisible": "newTabVisible"; "tabStripVisible": "tabStripVisible"; "tabEditable": "tabEditable"; "tabStripRatio": "tabStripRatio"; "tabNavigationVisible": "tabNavigationVisible"; "autoFitType": "autoFitType"; "referenceStyle": "referenceStyle"; "backColor": "backColor"; "grayAreaBackColor": "grayAreaBackColor"; "resizeZeroIndicator": "resizeZeroIndicator"; "showVerticalScrollbar": "showVerticalScrollbar"; "showHorizontalScrollbar": "showHorizontalScrollbar"; "scrollbarMaxAlign": "scrollbarMaxAlign"; "scrollIgnoreHidden": "scrollIgnoreHidden"; "hostStyle": "hostStyle"; "hostClass": "hostClass"; "hideSelection": "hideSelection"; "name": "name"; "backgroundImage": "backgroundImage"; "backgroundImageLayout": "backgroundImageLayout"; "showScrollTip": "showScrollTip"; "showResizeTip": "showResizeTip"; "showDragDropTip": "showDragDropTip"; "showDragFillTip": "showDragFillTip"; "showDragFillSmartTag": "showDragFillSmartTag"; "scrollbarShowMax": "scrollbarShowMax"; "useTouchLayout": "useTouchLayout"; }, { "workbookInitialized": "workbookInitialized"; "validationError": "validationError"; "cellClick": "cellClick"; "cellDoubleClick": "cellDoubleClick"; "enterCell": "enterCell"; "leaveCell": "leaveCell"; "valueChanged": "valueChanged"; "topRowChanged": "topRowChanged"; "leftColumnChanged": "leftColumnChanged"; "invalidOperation": "invalidOperation"; "rangeFiltering": "rangeFiltering"; "rangeFiltered": "rangeFiltered"; "tableFiltering": "tableFiltering"; "tableFiltered": "tableFiltered"; "rangeSorting": "rangeSorting"; "rangeSorted": "rangeSorted"; "clipboardChanging": "clipboardChanging"; "clipboardChanged": "clipboardChanged"; "clipboardPasting": "clipboardPasting"; "clipboardPasted": "clipboardPasted"; "columnWidthChanging": "columnWidthChanging"; "columnWidthChanged": "columnWidthChanged"; "rowHeightChanging": "rowHeightChanging"; "rowHeightChanged": "rowHeightChanged"; "dragDropBlock": "dragDropBlock"; "dragDropBlockCompleted": "dragDropBlockCompleted"; "dragFillBlock": "dragFillBlock"; "dragFillBlockCompleted": "dragFillBlockCompleted"; "editStarting": "editStarting"; "editChange": "editChange"; "editEnding": "editEnding"; "editEnd": "editEnd"; "editEnded": "editEnded"; "rangeGroupStateChanging": "rangeGroupStateChanging"; "rangeGroupStateChanged": "rangeGroupStateChanged"; "selectionChanging": "selectionChanging"; "selectionChanged": "selectionChanged"; "sheetTabClick": "sheetTabClick"; "sheetTabDoubleClick": "sheetTabDoubleClick"; "sheetNameChanging": "sheetNameChanging"; "sheetNameChanged": "sheetNameChanged"; "userZooming": "userZooming"; "userFormulaEntered": "userFormulaEntered"; "cellChanged": "cellChanged"; "columnChanged": "columnChanged"; "rowChanged": "rowChanged"; "activeSheetChanging": "activeSheetChanging"; "activeSheetChanged": "activeSheetChanged"; "sparklineChanged": "sparklineChanged"; "rangeChanged": "rangeChanged"; "buttonClicked": "buttonClicked"; "editorStatusChanged": "editorStatusChanged"; "floatingObjectChanged": "floatingObjectChanged"; "floatingObjectSelectionChanged": "floatingObjectSelectionChanged"; "pictureChanged": "pictureChanged"; "floatingObjectRemoving": "floatingObjectRemoving"; "floatingObjectRemoved": "floatingObjectRemoved"; "pictureSelectionChanged": "pictureSelectionChanged"; "floatingObjectLoaded": "floatingObjectLoaded"; "touchToolStripOpening": "touchToolStripOpening"; "commentChanged": "commentChanged"; "commentRemoving": "commentRemoving"; "commentRemoved": "commentRemoved"; "slicerChanged": "slicerChanged"; }, ["sheets"], ["*"]>;
}

//# sourceMappingURL=spreadSheets.component.d.ts.map
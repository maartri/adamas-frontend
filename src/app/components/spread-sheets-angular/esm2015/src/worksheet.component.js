/*import_begin*/
import { Component, ContentChildren, Input, } from '@angular/core';
/*import_end*/
import { ColumnComponent } from './column.component';
import * as GC from '@grapecity/spread-sheets';
/*code_begin*/
export class WorksheetComponent {
    constructor() {
        this.sheet = new GC.Spread.Sheets.Worksheet('');
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
WorksheetComponent.decorators = [
    { type: Component, args: [{
                selector: 'gc-worksheet',
                template: `
        <ng-content></ng-content>
    `
            },] }
];
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
/*code_end*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya3NoZWV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy93b3Jrc2hlZXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdCQUFnQjtBQUNoQixPQUFPLEVBRUwsU0FBUyxFQUNULGVBQWUsRUFDZixLQUFLLEdBSU4sTUFBTSxlQUFlLENBQUM7QUFDdkIsY0FBYztBQUNkLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNyRCxPQUFPLEtBQUssRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQy9DLGNBQWM7QUFPZCxNQUFNLE9BQU8sa0JBQWtCO0lBc0M3QjtRQUNFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVNLFVBQVU7UUFDZixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3pCLE1BQU0sT0FBTyxHQUFJLElBQUksQ0FBQyxPQUFzQyxDQUFDO1FBQzdELEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNyQixLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDckIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3JDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxlQUFnQyxFQUFFLEtBQWEsRUFBRSxFQUFFO2dCQUNsRSxJQUFJLGVBQWUsQ0FBQyxTQUFTLEVBQUU7b0JBQzdCLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFO3dCQUN0QixJQUFJLEVBQUUsZUFBZSxDQUFDLFNBQVM7d0JBQy9CLFdBQVcsRUFBRSxlQUFlLENBQUMsVUFBVTtxQkFDeEMsQ0FBQyxDQUFDO2lCQUNKO1lBQ0gsQ0FBQyxDQUFDLENB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Q0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3RELElBQUksVUFBVSxLQUFLLEtBQUssQ0FBQyxFQUFFO2dCQUN6QixNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ2hDO1NBQ0Y7SUFDSCxDQUFDOzs7WUF2S0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4QixRQUFRLEVBQUU7O0tBRVA7YUFDSjs7OztzQkFHRSxlQUFlLFNBQUMsZUFBZTt1QkFJL0IsS0FBSzt1QkFDTCxLQUFLO3lCQUNMLEtBQUs7bUJBQ0wsS0FBSztnQ0FDTCxLQUFLOzZCQUNMLEtBQUs7cUNBQ0wsS0FBSzt3Q0FDTCxLQUFLO2dDQUNMLEtBQUs7OEJBQ0wsS0FBSzs0QkFDTCxLQUFLOzhCQUNMLEtBQUs7NEJBQ0wsS0FBSzttQkFDTCxLQUFLOzJCQUNMLEtBQUs7K0JBQ0wsS0FBSzsrQkFDTCxLQUFLOytCQUNMLEtBQUs7Z0NBQ0wsS0FBSztnQ0FDTCxLQUFLO3FDQUNMLEtBQUs7cUNBQ0wsS0FBSzswQkFDTCxLQUFLOzZCQUNMLEtBQUs7Z0NBQ0wsS0FBSztpQ0FDTCxLQUFLO21DQUNMLEtBQUs7MkJBQ0wsS0FBSzs2QkFDTCxLQUFLO2dDQUNMLEtBQUs7a0NBQ0wsS0FBSzs7QUErSFIsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbIi8qaW1wb3J0X2JlZ2luKi9cclxuaW1wb3J0IHtcclxuICBBZnRlclZpZXdJbml0LFxyXG4gIENvbXBvbmVudCxcclxuICBDb250ZW50Q2hpbGRyZW4sXHJcbiAgSW5wdXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIE9uRGVzdHJveSxcclxuICBRdWVyeUxpc3QsIFNpbXBsZUNoYW5nZXMsXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbi8qaW1wb3J0X2VuZCovXHJcbmltcG9ydCB7IENvbHVtbkNvbXBvbmVudCB9IGZyb20gJy4vY29sdW1uLmNvbXBvbmVudCc7XHJcbmltcG9ydCAqIGFzIEdDIGZyb20gJ0BncmFwZWNpdHkvc3ByZWFkLXNoZWV0cyc7XHJcbi8qY29kZV9iZWdpbiovXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZ2Mtd29ya3NoZWV0JyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cclxuICAgIGAsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBXb3Jrc2hlZXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xyXG4gIHByaXZhdGUgc2hlZXQ6IEdDLlNwcmVhZC5TaGVldHMuV29ya3NoZWV0O1xyXG4gIEBDb250ZW50Q2hpbGRyZW4oQ29sdW1uQ29tcG9uZW50KVxyXG4gIHB1YmxpYyBjb2x1bW5zPzogUXVlcnlMaXN0PENvbHVtbkNvbXBvbmVudD47XHJcblxyXG4gIC8vIGluZGljYXRlIGFsbCBpbnB1dHNcclxuICBASW5wdXQoKSBwdWJsaWMgcm93Q291bnQ/OiBudW1iZXI7XHJcbiAgQElucHV0KCkgcHVibGljIGNvbENvdW50PzogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBkYXRhU291cmNlOiBhbnk7XHJcbiAgQElucHV0KCkgcHVibGljIG5hbWU/OiBzdHJpbmc7XHJcbiAgQElucHV0KCkgcHVibGljIGZyb3plbkNvbHVtbkNvdW50PzogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBmcm96ZW5Sb3dDb3VudD86IG51bWJlcjtcclxuICBASW5wdXQoKSBwdWJsaWMgZnJvemVuVHJhaWxpbmdSb3dDb3VudD86IG51bWJlcjtcclxuICBASW5wdXQoKSBwdWJsaWMgZnJvemVuVHJhaWxpbmdDb2x1bW5Db3VudD86IG51bWJlcjtcclxuICBASW5wdXQoKSBwdWJsaWMgYWxsb3dDZWxsT3ZlcmZsb3c/OiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBmcm96ZW5saW5lQ29sb3I/OiBzdHJpbmc7XHJcbiAgQElucHV0KCkgcHVibGljIHNoZWV0VGFiQ29sb3I/OiBzdHJpbmc7XHJcbiAgQElucHV0KCkgcHVibGljIHNlbGVjdGlvblBvbGljeT86IG51bWJlcjtcclxuICBASW5wdXQoKSBwdWJsaWMgc2VsZWN0aW9uVW5pdD86IG51bWJlcjtcclxuICBASW5wdXQoKSBwdWJsaWMgem9vbT86IG51bWJlcjtcclxuICBASW5wdXQoKSBwdWJsaWMgY3VycmVudFRoZW1lPzogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBjbGlwQm9hcmRPcHRpb25zPzogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyByb3dIZWFkZXJWaXNpYmxlPzogYm9vbGVhbjtcclxuICBASW5wdXQoKSBwdWJsaWMgY29sSGVhZGVyVmlzaWJsZT86IGJvb2xlYW47XHJcbiAgQElucHV0KCkgcHVibGljIHJvd0hlYWRlckF1dG9UZXh0PzogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xIZWFkZXJBdXRvVGV4dD86IG51bWJlcjtcclxuICBASW5wdXQoKSBwdWJsaWMgcm93SGVhZGVyQXV0b1RleHRJbmRleD86IG51bWJlcjtcclxuICBASW5wdXQoKSBwdWJsaWMgY29sSGVhZGVyQXV0b1RleHRJbmRleD86IG51bWJlcjtcclxuICBASW5wdXQoKSBwdWJsaWMgaXNQcm90ZWN0ZWQ/OiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBzaG93Um93T3V0bGluZT86IGJvb2xlYW47XHJcbiAgQElucHV0KCkgcHVibGljIHNob3dDb2x1bW5PdXRsaW5lPzogYm9vbGVhbjtcclxuICBASW5wdXQoKSBwdWJsaWMgc2VsZWN0aW9uQmFja0NvbG9yPzogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBzZWxlY3Rpb25Cb3JkZXJDb2xvcj86IHN0cmluZztcclxuICBASW5wdXQoKSBwdWJsaWMgZGVmYXVsdFN0eWxlPzogR0MuU3ByZWFkLlNoZWV0cy5TdHlsZTtcclxuICBASW5wdXQoKSBwdWJsaWMgcm93T3V0bGluZUluZm8/OiBhbnlbXTtcclxuICBASW5wdXQoKSBwdWJsaWMgY29sdW1uT3V0bGluZUluZm8/OiBhbnlbXTtcclxuICBASW5wdXQoKSBwdWJsaWMgYXV0b0dlbmVyYXRlQ29sdW1ucz86IGJvb2xlYW47XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zaGVldCA9IG5ldyBHQy5TcHJlYWQuU2hlZXRzLldvcmtzaGVldCgnJyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25BdHRhY2hlZCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNoZWV0ID0gdGhpcy5zaGVldDtcclxuICAgIGNvbnN0IGNvbHVtbnMgPSAodGhpcy5jb2x1bW5zIGFzIFF1ZXJ5TGlzdDxDb2x1bW5Db21wb25lbnQ+KTtcclxuICAgIHNoZWV0LnN1c3BlbmRQYWludCgpO1xyXG4gICAgc2hlZXQuc3VzcGVuZEV2ZW50KCk7XHJcbiAgICBpZiAodGhpcy5kYXRhU291cmNlKSB7XHJcbiAgICAgIHNoZWV0LnNldERhdGFTb3VyY2UodGhpcy5kYXRhU291cmNlKTtcclxuICAgICAgY29sdW1ucy5mb3JFYWNoKChjb2x1bW5Db21wb25lbnQ6IENvbHVtbkNvbXBvbmVudCwgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgIGlmIChjb2x1bW5Db21wb25lbnQuZGF0YUZpZWxkKSB7XHJcbiAgICAgICAgICBzaGVldC5iaW5kQ29sdW1uKGluZGV4LCB7XHJcbiAgICAgICAgICAgIG5hbWU6IGNvbHVtbkNvbXBvbmVudC5kYXRhRmllbGQsXHJcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBjb2x1bW5Db21wb25lbnQuaGVhZGVyVGV4dCxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAoY29sdW1ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHNoZWV0LnNldENvbHVtbkNvdW50KGNvbHVtbnMubGVuZ3RoKTtcclxuICAgICAgY29sdW1ucy5mb3JFYWNoKChjb2x1bW5Db21wb25lbnQ6IENvbHVtbkNvbXBvbmVudCwgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgIGNvbHVtbkNvbXBvbmVudC5vbkF0dGFjaGVkKHRoaXMuc2hlZXQsIGluZGV4KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzaGVldC5yZXN1bWVFdmVudCgpO1xyXG4gICAgc2hlZXQucmVzdW1lUGFpbnQoKTtcclxuICB9XHJcbiAgcHVibGljIGdldFNoZWV0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2hlZXQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xyXG4gICAgY29uc3Qgc2hlZXQgPSB0aGlzLnNoZWV0O1xyXG4gICAgc2hlZXQuc3VzcGVuZFBhaW50KCk7XHJcbiAgICBzaGVldC5zdXNwZW5kRXZlbnQoKTtcclxuICAgIGZvciAoY29uc3QgY2hhbmdlTmFtZSBpbiBjaGFuZ2VzKSB7XHJcbiAgICAgIGNvbnN0IG5ld1ZhbHVlID0gY2hhbmdlc1tjaGFuZ2VOYW1lXS5jdXJyZW50VmFsdWU7XHJcbiAgICAgIGlmIChuZXdWYWx1ZSA9PT0gbnVsbCB8fCBuZXdWYWx1ZSA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuICAgICAgc3dpdGNoIChjaGFuZ2VOYW1lKSB7XHJcbiAgICAgICAgY2FzZSAncm93Q291bnQnOlxyXG4gICAgICAgICAgc2hlZXQuc2V0Um93Q291bnQobmV3VmFsdWUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnY29sQ291bnQnOlxyXG4gICAgICAgICAgc2hlZXQuc2V0Q29sdW1uQ291bnQobmV3VmFsdWUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnbmFtZSc6XHJcbiAgICAgICAgICBzaGVldC5uYW1lKG5ld1ZhbHVlKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2Zyb3plbkNvbHVtbkNvdW50JzpcclxuICAgICAgICAgIHNoZWV0LmZyb3plbkNvbHVtbkNvdW50KG5ld1ZhbHVlKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2Zyb3plblJvd0NvdW50JzpcclxuICAgICAgICAgIHNoZWV0LmZyb3plblJvd0NvdW50KG5ld1ZhbHVlKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2Zyb3plblRyYWlsaW5nUm93Q291bnQnOlxyXG4gICAgICAgICAgc2hlZXQuZnJvemVuVHJhaWxpbmdSb3dDb3VudChuZXdWYWx1ZSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdmcm96ZW5UcmFpbGluZ0NvbHVtbkNvdW50JzpcclxuICAgICAgICAgIHNoZWV0LmZyb3plblRyYWlsaW5nQ29sdW1uQ291bnQobmV3VmFsdWUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnc2VsZWN0aW9uUG9saWN5JzpcclxuICAgICAgICAgIHNoZWV0LnNlbGVjdGlvblBvbGljeShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdzZWxlY3Rpb25Vbml0JzpcclxuICAgICAgICAgIHNoZWV0LnNlbGVjdGlvblVuaXQobmV3VmFsdWUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnem9vbSc6XHJcbiAgICAgICAgICBzaGVldC56b29tKG5ld1ZhbHVlKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2N1cnJlbnRUaGVtZSc6XHJcbiAgICAgICAgICBzaGVldC5jdXJyZW50VGhlbWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnZGVmYXVsdFN0eWxlJzpcclxuICAgICAgICAgIHNoZWV0LnNldERlZmF1bHRTdHlsZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdyb3dPdXRsaW5lSW5mbyc6XHJcbiAgICAgICAgICBuZXdWYWx1ZS5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgc2hlZXQucm93T3V0bGluZXMuZ3JvdXAoaXRlbS5pbmRleCwgaXRlbS5jb3VudCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHNoZWV0LnJlcGFpbnQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2NvbHVtbk91dGxpbmVJbmZvJzpcclxuICAgICAgICAgIG5ld1ZhbHVlLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBzaGVldC5jb2x1bW5PdXRsaW5lcy5ncm91cChpdGVtLmluZGV4LCBpdGVtLmNvdW50KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgc2hlZXQucmVwYWludCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnc2hvd1Jvd091dGxpbmUnOlxyXG4gICAgICAgICAgc2hlZXQuc2hvd1Jvd091dGxpbmUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnc2hvd0NvbHVtbk91dGxpbmUnOlxyXG4gICAgICAgICAgc2hlZXQuc2hvd0NvbHVtbk91dGxpbmUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnZGF0YVNvdXJjZSc6XHJcbiAgICAgICAgICBzaGVldC5zZXREYXRhU291cmNlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2F1dG9HZW5lcmF0ZUNvbHVtbnMnOlxyXG4gICAgICAgICAgc2hlZXRbY2hhbmdlTmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgKHNoZWV0Lm9wdGlvbnMgYXMgYW55KVtjaGFuZ2VOYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBzaGVldC5yZXN1bWVFdmVudCgpO1xyXG4gICAgc2hlZXQucmVzdW1lUGFpbnQoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICAodGhpcy5jb2x1bW5zIGFzIFF1ZXJ5TGlzdDxDb2x1bW5Db21wb25lbnQ+KS5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7IHRoaXMub25BdHRhY2hlZCgpOyB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcclxuICAgIGNvbnN0IHNoZWV0ID0gdGhpcy5zaGVldDtcclxuICAgIGNvbnN0IHNwcmVhZCA9IHNoZWV0ID8gc2hlZXQuZ2V0UGFyZW50KCkgOiBudWxsO1xyXG4gICAgaWYgKHNwcmVhZCkge1xyXG4gICAgICBjb25zdCBzaGVldEluZGV4ID0gc3ByZWFkLmdldFNoZWV0SW5kZXgoc2hlZXQubmFtZSgpKTtcclxuICAgICAgaWYgKHNoZWV0SW5kZXggIT09IHZvaWQgMCkge1xyXG4gICAgICAgIHNwcmVhZC5yZW1vdmVTaGVldChzaGVldEluZGV4KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4vKmNvZGVfZW5kKi9cclxuIl19
/*import_begin*/
import { Component, Input } from '@angular/core';
import * as GC from '@grapecity/spread-sheets';
/*import_end*/
/*code_begin*/
export class ColumnComponent {
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
ColumnComponent.decorators = [
    { type: Component, args: [{
                selector: 'gc-column',
                template: `
        <ng-content></ng-content>
    `
            },] }
];
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
/*code_end*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb2x1bW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdCQUFnQjtBQUNoQixPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBNEIsTUFBTSxlQUFlLENBQUM7QUFDM0UsT0FBTyxLQUFLLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMvQyxjQUFjO0FBRWQsY0FBYztBQU9kLE1BQU0sT0FBTyxlQUFlO0lBTjVCO1FBT1UsWUFBTyxHQUFRLEVBQUUsQ0FBQztJQTRFNUIsQ0FBQztJQTVEUSxVQUFVLENBQUMsS0FBaUMsRUFBRSxLQUFhO1FBQ2hFLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRU8sZUFBZTtRQUNyQixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3pCLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNyQixLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDckIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUM3QixLQUFLLE1BQU0sVUFBVSxJQUFJLE9BQU8sRUFBRTtnQkFDaEMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFlBQVksQ0FBQztnQkFDaEQsSUFBSSxRQUFRLEtBQUssSUFBSSxJQUFJLFFBQVEsS0FBSyxLQUFLLENBQUMsRUFBRTtvQkFDNUMsU0FBUztpQkFDVjtnQkFDRCxRQUFRLFVBQVUsRUFBRTtvQkFDbEIsS0FBSyxPQUFPO3dCQUNWLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUNsQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7d0JBQ3JELE1BQU07b0JBQ1IsS0FBSyxTQUFTO3dCQUNaLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO3dCQUN2RCxNQUFNO29CQUNSLEtBQUssV0FBVzt3QkFDZCxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQzt3QkFDekQsTUFBTTtvQkFDUixLQUFLLFNBQVM7d0JBQ1osSUFBSSxRQUFRLEVBQUU7NEJBQ1osS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBZSxDQUFDLENBQUM7eUJBQzNDO3dCQUNELE1BQU07b0JBQ1IsS0FBSyxPQUFPO3dCQUNWLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQzt3QkFDbkQsTUFBTTtvQkFDUixLQUFLLGFBQWE7d0JBQ2hCLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQWUsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUN6RixNQUFNO29CQUNSLEtBQUssVUFBVTt3QkFDYixLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7d0JBQ3RELE1BQU07b0JBQ1IsS0FBSyxXQUFXO3dCQUNkLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQWUsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUM1RixNQUFNO2lCQUNUO2FBQ0Y7WUFDRCxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDcEIsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQztJQUVNLFdBQVcsQ0FBQyxPQUFzQjtRQUN2QyxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ2xDLEtBQUssTUFBTSxVQUFVLElBQUksT0FBTyxFQUFFO1lBQ2hDLFlBQVksQ0FBQyxVQUFVLENBQUMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDaEQ7UUFDRCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDekIsQ0FBQzs7O1lBbEZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsV0FBVztnQkFDckIsUUFBUSxFQUFFOztLQUVQO2FBQ0o7OztvQkFPRSxLQUFLO3dCQUNMLEtBQUs7eUJBQ0wsS0FBSztzQkFDTCxLQUFLO3dCQUNMLEtBQUs7c0JBQ0wsS0FBSztvQkFDTCxLQUFLO3VCQUNMLEtBQUs7MEJBQ0wsS0FBSzt3QkFDTCxLQUFLOztBQStEUixZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiLyppbXBvcnRfYmVnaW4qL1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0ICogYXMgR0MgZnJvbSAnQGdyYXBlY2l0eS9zcHJlYWQtc2hlZXRzJztcclxuLyppbXBvcnRfZW5kKi9cclxuXHJcbi8qY29kZV9iZWdpbiovXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZ2MtY29sdW1uJyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cclxuICAgIGAsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDb2x1bW5Db21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xyXG4gIHByaXZhdGUgY2hhbmdlczogYW55ID0ge307XHJcbiAgcHJpdmF0ZSBzaGVldD86IEdDLlNwcmVhZC5TaGVldHMuV29ya3NoZWV0O1xyXG4gIHByaXZhdGUgaW5kZXg/OiBudW1iZXI7XHJcblxyXG4gIC8vIGluZGljYXRlIGFsbCBpbnB1dHNcclxuICBASW5wdXQoKSBwdWJsaWMgd2lkdGg/OiBudW1iZXI7XHJcbiAgQElucHV0KCkgcHVibGljIGRhdGFGaWVsZD86IHN0cmluZztcclxuICBASW5wdXQoKSBwdWJsaWMgaGVhZGVyVGV4dD86IHN0cmluZztcclxuICBASW5wdXQoKSBwdWJsaWMgdmlzaWJsZT86IGJvb2xlYW47XHJcbiAgQElucHV0KCkgcHVibGljIHJlc2l6YWJsZT86IGJvb2xlYW47XHJcbiAgQElucHV0KCkgcHVibGljIGF1dG9GaXQ/OiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBzdHlsZT86IEdDLlNwcmVhZC5TaGVldHMuU3R5bGU7XHJcbiAgQElucHV0KCkgcHVibGljIGNlbGxUeXBlPzogR0MuU3ByZWFkLlNoZWV0cy5DZWxsVHlwZXMuQmFzZTtcclxuICBASW5wdXQoKSBwdWJsaWMgaGVhZGVyU3R5bGU/OiBHQy5TcHJlYWQuU2hlZXRzLlN0eWxlO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBmb3JtYXR0ZXI6IGFueTtcclxuXHJcbiAgcHVibGljIG9uQXR0YWNoZWQoc2hlZXQ6IEdDLlNwcmVhZC5TaGVldHMuV29ya3NoZWV0LCBpbmRleDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLnNoZWV0ID0gc2hlZXQ7XHJcbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XHJcbiAgICB0aGlzLm9uQ29sdW1uQ2hhbmdlZCgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvbkNvbHVtbkNoYW5nZWQoKSB7XHJcbiAgICBpZiAodGhpcy5zaGVldCkge1xyXG4gICAgICBjb25zdCBzaGVldCA9IHRoaXMuc2hlZXQ7XHJcbiAgICAgIHNoZWV0LnN1c3BlbmRQYWludCgpO1xyXG4gICAgICBzaGVldC5zdXNwZW5kRXZlbnQoKTtcclxuICAgICAgY29uc3QgY2hhbmdlcyA9IHRoaXMuY2hhbmdlcztcclxuICAgICAgZm9yIChjb25zdCBjaGFuZ2VOYW1lIGluIGNoYW5nZXMpIHtcclxuICAgICAgICBsZXQgbmV3VmFsdWUgPSBjaGFuZ2VzW2NoYW5nZU5hbWVdLmN1cnJlbnRWYWx1ZTtcclxuICAgICAgICBpZiAobmV3VmFsdWUgPT09IG51bGwgfHwgbmV3VmFsdWUgPT09IHZvaWQgMCkge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN3aXRjaCAoY2hhbmdlTmFtZSkge1xyXG4gICAgICAgICAgY2FzZSAnd2lkdGgnOlxyXG4gICAgICAgICAgICBuZXdWYWx1ZSA9IHBhcnNlSW50KG5ld1ZhbHVlLCAxMCk7XHJcbiAgICAgICAgICAgIHNoZWV0LnNldENvbHVtbldpZHRoKHRoaXMuaW5kZXggYXMgbnVtYmVyLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSAndmlzaWJsZSc6XHJcbiAgICAgICAgICAgIHNoZWV0LnNldENvbHVtblZpc2libGUodGhpcy5pbmRleCBhcyBudW1iZXIsIG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdyZXNpemFibGUnOlxyXG4gICAgICAgICAgICBzaGVldC5zZXRDb2x1bW5SZXNpemFibGUodGhpcy5pbmRleCBhcyBudW1iZXIsIG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdhdXRvRml0JzpcclxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgc2hlZXQuYXV0b0ZpdENvbHVtbih0aGlzLmluZGV4IGFzIG51bWJlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdzdHlsZSc6XHJcbiAgICAgICAgICAgIHNoZWV0LnNldFN0eWxlKC0xLCB0aGlzLmluZGV4IGFzIG51bWJlciwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgJ2hlYWRlclN0eWxlJzpcclxuICAgICAgICAgICAgc2hlZXQuc2V0U3R5bGUoLTEsIHRoaXMuaW5kZXggYXMgbnVtYmVyLCBuZXdWYWx1ZSwgR0MuU3ByZWFkLlNoZWV0cy5TaGVldEFyZWEuY29sSGVhZGVyKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdjZWxsVHlwZSc6XHJcbiAgICAgICAgICAgIHNoZWV0LnNldENlbGxUeXBlKC0xLCB0aGlzLmluZGV4IGFzIG51bWJlciwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgJ2Zvcm1hdHRlcic6XHJcbiAgICAgICAgICAgIHNoZWV0LnNldEZvcm1hdHRlcigtMSwgdGhpcy5pbmRleCBhcyBudW1iZXIsIG5ld1ZhbHVlLCBHQy5TcHJlYWQuU2hlZXRzLlNoZWV0QXJlYS52aWV3cG9ydCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBzaGVldC5yZXN1bWVFdmVudCgpO1xyXG4gICAgICBzaGVldC5yZXN1bWVQYWludCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgIHRoaXMuY2hhbmdlcyA9IHt9O1xyXG4gICAgY29uc3QgY2hhbmdlc0NhY2hlID0gdGhpcy5jaGFuZ2VzO1xyXG4gICAgZm9yIChjb25zdCBjaGFuZ2VOYW1lIGluIGNoYW5nZXMpIHtcclxuICAgICAgY2hhbmdlc0NhY2hlW2NoYW5nZU5hbWVdID0gY2hhbmdlc1tjaGFuZ2VOYW1lXTtcclxuICAgIH1cclxuICAgIHRoaXMub25Db2x1bW5DaGFuZ2VkKCk7XHJcbiAgfVxyXG59XHJcbi8qY29kZV9lbmQqL1xyXG4iXX0=
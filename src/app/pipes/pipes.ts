import { Pipe, PipeTransform} from '@angular/core';
import * as moment from "moment";
import format  from 'date-fns/format';

@Pipe({ name: 'dmz' })
export class DayManagerPopulate implements PipeTransform {
    transform(value: any, dayPop: any) {
        let total: number = 0;
        let filtered: Array<any> = [];

        filtered = value.filter(x => x.date == format(new Date(dayPop), 'yyyy/MM/dd'));
        filtered.forEach(x => {
            if (x.ShiftType && (x.ShiftType).toUpperCase() !== 'UNAVAILABLE') {
                total = (total + x.Duration * 5);
            }
        });
        total = total / 60;

        if (filtered.length == 0)
            filtered.push({ isNone: true });
        else
            filtered.push({ isLast: true, total: total });

        return filtered;
    }
}

@Pipe({ name: 'removefirstlast' })
export class RemoveFirstLast implements PipeTransform {
    transform(value: string): string {
        let temp = value;
        if (value.slice(0, 1) == "<" && value.slice(-1) == ">")
            temp = temp.slice(1, -1);

        return temp;
    }
}

@Pipe({ name: 'momentTimePackage' })
export class MomentTimePackage implements PipeTransform {
    transform(value: string): string {
        const time = moment(value).format('HH:mm');
        return time === "00:00" ? "12:00" : time;
    }
}

@Pipe({ name: 'splitArr' })
export class SplitArrayPipe implements PipeTransform {
    transform(value: any, arg1: any, arg2: any) {
        return value.slice(arg1, arg2);
    }
}

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
    transform(value: any, filter: any): any {
        if (filter && Array.isArray(value)) {
            return value.filter(item => {
                return (new RegExp(filter, 'gi').test(item.accountNo) == true);
            });
        } else {
            return value;
        }
    }
}

@Pipe({ name: 'keys' })
export class KeyFilter implements PipeTransform {
    transform(value: any): any {
        let keyArr = [];
        for (let key in value) {
            keyArr.push({ key: key, value: value[key] });
        }
        return keyArr;
    }
}

@Pipe({ name: 'keyValue' })
export class KeyValueFilter implements PipeTransform {
    transform(value: any): any {
        if (!value) return;
        return Object.keys(value[0]);
    }
}

@Pipe({ name: 'fileNameFilter' })
export class FileNameFilter implements PipeTransform {
    transform(value: any): any {
        return value.split('.')[0];
    }
}

@Pipe({ name: 'fileSizeFilter' })
export class FileSizeFilter implements PipeTransform {
    transform(value: any): any {
        if (12000 < value) {
            return (value / Math.pow(1024, 2)).toFixed(2) + ' MB'
        }
        return value + ' BYTES'
    }
}

@Pipe({ name: 'monthPeriodFilter' })
export class MonthPeriodFilter implements PipeTransform {
    transform(value: any): any {
        const startOfMonth = moment(value).startOf('month').format('MMMM DD');
        const endOfMonth = moment(value).endOf('month').format('-DD YYYY');
        return startOfMonth + ' ' + endOfMonth;
    }
}
@Pipe({ name: 'getTextFromHtml' })
export class GetTextFromHtml implements PipeTransform {
    transform(value: any): any {
        if(value != null)
        return value.replace(/<[^>]+>/g,'');
        
        return value;
        // newstring.Replace(Convert.ToChar(160), ' ');
        // var parser = new DOMParser();
        // var parsetext = parser.parseFromString(value,'text/html');
        // return parsetext;
    }
}
@Pipe({ name: 'replaceNullWithText' })
  export class ReplaceNullWithTextPipe implements PipeTransform {
    transform(value: any, repleceText: string = " "): any {
      if (typeof value === 'undefined' || value === null) {
        return repleceText;
      }
      return value;
    }
  }


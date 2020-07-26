import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { GlobalService, ClientService } from '@services/index';
import { forkJoin,  Subject ,  Observable } from 'rxjs';

class Address {
    postcode: string;
    address: string;
    suburb: string;
    state: string;

    constructor(postcode: string, address: string, suburb: string, state: string) {
        this.suburb = suburb.trim();
        this.address = address;
        this.postcode = postcode;
        this.state = state;
    }

    getAddress() {
        var _address = `${this.address} ${this.suburb} ${this.postcode}`;
        return (_address.split(' ').join('+')).split('/').join('%2F');
    }
}

@Component({
    styles: [`
    .dm-input{
        margin-bottom:1rem;
    }
    nz-modal.options >>> div div div.ant-modal div.ant-modal-content div.ant-modal-body{
        padding:0;
    }
    nz-modal.options >>> div div div.ant-modal div.ant-modal-content div.ant-modal-footer{
        padding:0;
    }
    ul{
        list-style: none;
        padding: 5px 0 5px 15px;
        margin: 0;
    }
    li {
        padding: 4px 0 4px 10px;
        font-size: 13px;
        position:relative;
        cursor:pointer;
    }
    li:hover{
        background:#f2f2f2;
    }
    li i {
        float:right;
        margin-right:7px;
    }
    hr{
        border: none;
        height: 1px;
        background: #e5e5e5;
        margin: 2px 0;
    }
    li > ul{
        position: absolute;
        display:none;         
        right: -192px;
        padding: 2px 5px;
        background: #fff;
        top: -6px;
        width: 192px;
        transition: all 0.5s ease 3s;
    }
    li:hover > ul{           
        display:block;
        transition: all 0.5s ease 0s;
    }
    `],
    templateUrl: './daymanager.html'
})


export class DayManagerAdmin implements OnInit, OnDestroy {
    date: any = new Date();
    dayView: number = 7;
    dayViewArr: Array<number> = [5, 7, 10, 14];
    reload: boolean = false;
    toBePasted: Array<any>;

    optionsModal: boolean = false;
    recipientDetailsModal: boolean = false;
    changeModalView = new Subject<number>();

    selectedOption:any;

    _highlighted: Array<any> = [];
    private address: Array<any> = [];

    changeViewRecipientDetails = new Subject<number>();

    user:any;

    constructor(
        private globalS: GlobalService,
        private clientS: ClientService
    ) {

        this.changeViewRecipientDetails.subscribe(data => {
            // console.log(data);
            this.user = {
                name: this.selectedOption.Recipient,
                code: this.selectedOption.uniqueid,
                startDate: '2019/01/15',
                endDate: '2019/01/29'
            }            
            // this.tabvrd = data;
            this.recipientDetailsModal = true;
        });

        this.changeModalView.subscribe(data => {
            console.log(data);
        });
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

    showDetail(data: any) {
        console.log(data);
    }

    showOptions(data: any) {
        console.log(data);
        this.selectedOption = data.selected; 

        var uniqueIds = this._highlighted.reduce((acc, data) => {
            acc.push(data.uniqueid);
            return acc;
        },[]);

        var sss = uniqueIds.length > 0 ? uniqueIds : [this.selectedOption.uniqueid]
    
        this.clientS.gettopaddress(sss)
            .subscribe(data => this.address = data)

        this.optionsModal = true;
    }

    highlighted(data: any) {
        this._highlighted = data;
    }

    data(data: any) {

    }

    pasted(data: any) {

    }
    
    handleCancel(): void{
        this.optionsModal = false;
        this.recipientDetailsModal = false;
    }

    toMap(){

        if(this.address.length > 0){         

            var adds = this.address.reduce((acc,data) => {
                var { postCode, address1, suburb, state } = data;
                var address = new Address(postCode, address1, suburb, state);
                return acc.concat('/',address.getAddress());                
            }, []);
            console.log(adds)
            console.log(adds.join(''))
                
            //window.open('https://www.google.com/maps/search/?api=1&query=' + encoded,'_blank');
            window.open(`https://www.google.com/maps/dir${adds.join('')}`,'_blank');
            return false;
        }
        this.globalS.eToast('No address found','Error');
    }
}
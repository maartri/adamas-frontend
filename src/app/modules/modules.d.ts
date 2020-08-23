declare namespace Dto {
 
        export interface ApplicationUser {
            Username: string,
            Password: string,
            NewPassword?: string,
            PasswordHandler?: string
        }
    
        export interface Jwt {
            aud: string,
            code: string,
            exp: number,
            iss: string,
            jti: string,
            nbf: number,
            role: string,
            user: string
        }
    
        export interface Recipients {
            sqlID?: number,
            uniqueID?: string,
            filePhoto?: string,
            accountNo: string,
            firstName: string,
            middleNames: string,
            surnameOrg: string,
            gender: string,
            dateOfBirth: string,
            address1?: string,
            address2?: string,
            phone?: string,
            title: string,
            preferredName?: string,
            suburb?: string,
            postCode?: string,
            branch: string,
            contactIssues?: string,
            agencyIdReportingCode: string,
            urNumber: string,
            ubdMap: string,
            recipient_Coordinator: string,
            agencyDefinedGroup: string
        }
    
        export interface Staffs {
            sqlID?: number,
            uniqueID?: string,
            accountNo?: string,
            filePhoto?: string,
            title?: string,
            firstName?: string,
            middleNames?: string,
            lastName?: string,
            dob?: string,
            gender?: string,
            category?: string,
            stf_Code?: string,
            stf_Department?: string,
            staffGroup?: string,
            subCategory?: string,
            staffTeam?: string,
            pan_Manager?: string,
            serviceRegion?: string,
            dLicence?: string,
            vRegistration?: string,
            nRegistration?: string,
            isRosterable?: boolean,
            emailTimesheet?: boolean,
            caseManager?: boolean,
            ubdMap?: string,
            contactIssues?: string,
            rating?: string,
            caldStatus?: string,
            cstda_Indiginous?: string,
            cstda_DisabilityGroup?: string,
            cstda_OtherDisabilities?: string,
            preferredName?: string
        }
    
        export interface NamesAndAddresses {
            RecordNumber?: number,
            PersonID?: string,
            PrimaryAddress?: boolean,
            Stat?: string
            Description?: string,
            Address1?: string,
            Address2?: string,
            Suburb?: string,
            PostCode?: string,
        }
    
        export interface PhoneFaxOther {
            RecordNumber?: number,
            Type?: string,
            Detail?: string,
            PersonID?: string,
            PrimaryPhone?: boolean
        }
    
        export interface SuburbIn {
            Postcode: string,
            SuburbName: string
        }
    
        export interface ProgramActive {
            Code: string,
            IsActive: boolean
        }
    
        export interface GetPackage {
            Code: string,
            PCode: string,
            Date: string
        }
    
        export interface ApproveService {
            RecipientCode: string,
            BookDate: string,
            StartTime: string
        }
    
        export interface QualifiedStaff {
            RecipientCode: string,
            User?: string,
            BookDate?: string,
            StartTime?: string,
            EndTime?: string,
            EndLimit?: string,
            Gender?: string,
            Competencys?: string,
            CompetenciesCount?: number,
            TeamFilter?: string,
            CategoryFilter?: string
        }
    
        export interface AddBooking {
            BookType?: boolean,
            StaffCode?: string,
            StartDate?: string,
            StartTime?: string,
            Service: Dto.Service,
            ClientCode?: string,
            Duration?: string,
            Username?: string,
            AnyProvider: boolean,
            BookingType?: string,
            Notes?: string
        }
    
        export interface Service {
            ServiceName: string,
            ServiceProgram: string,
            ServiceType: string,
            ServiceBillRate: string
            ServiceUnit: string,
            ServiceImage: string
        }
    
        export interface GetTimesheet {
            AccountNo: string,
            User?: string,
            personType: string,
            s_status?: string,
            startDate?: string,
            endDate?: string,
            order_by?: string,
            Include_Prev_Paid_Shift_Activity?: boolean,
            Include_Absence?: boolean
        }
    
        export interface LeaveEntry {
            StaffCode: string,
            StartDate: string,
            EndDate: string,
            Address?: string,
            Message?: Dto.EmailMessage
            CoordinatorEmail: Dto.CoordinatorEmail
        }
    
        export interface ClaimVariation {
            RecordNo: string,
            ClaimedDate: string,
            ClaimedStart: string,
            ClaimedEnd: string,
            ClaimedBy: string
        }
    
        export interface TravelClaim {
            RecordNo?: string,
            User?: string,
            Distance?: string,
            TravelType?: string,
            ChargeType?: string,
            StartKm?: string,
            EndKm?: string,
            Notes?: string
        }
    
        export interface ClientNote {
            RecipientCode: string,
            PersonId: string,
            OperatorID: string,
            Note: string,
            Note_Type: string
        }
    
        export interface RosterNote {
            Note: string,
            RecordNo: string
        }
    
        export interface RecordIncident {
            PersonId: string,
            IncidentType: string,
            Service: string,
            IncidentSeverity: string,
            Location: string,
            Note: string,
            Staff: string,
            OperatorId: string,
            RecipientCode: string,
            Program: string,
            NoRecipient: boolean
        }
    
        export interface TravelDefaults {
            TravelType: boolean,
            ChargeType: boolean,
            VehicleType: boolean,
            StartKM: number,
            EndKM: number,
            Notes: string
        }
    
        export interface Roster {
            RosterType: string,
            AccountNo: string,
            StartDate: string,
            EndDate: string
        }
    
        export interface GetStaff {
            User: string,
            SearchString?: string,
            IncludeInactive?: boolean,
            Status?: string
        }
    
        export interface GetRecipient {
            User: string,
            SearchString?: string,
            IncludeInactive?: boolean,
            Status?: string
        }
    
        export interface DayManager {
            StartDate: string,
            EndDate: string
        }
    
        export interface RosterInput {
            Value: string,
            Key: string
        }
    
        export interface WorkerInput {
            ClientCode: string,
            StartDate: string,
            EndDate: string
        }
    
        export interface InputShiftSpecific {
            RecipientCode: string,
            ShiftDate: string,
            Approved: number
        }
    
        export interface InputShiftBooked {
            RecipientCode: string,
            ShiftDate: string,
            Pending: boolean
        }
    
        export interface InputFilter {
            User: string,
            SearchString: string,
            IncludeActive: boolean,
            Status: string
        }
    
        export interface Sample {
            Name: string,
            Id: number
        }
    
        export interface InputAllocateStaff {
            AccountNo: string,
            Activity: string
        }
    
        export interface ViewModal {
            Title: string,
            View: number,
            Option?: string
        }
    
        export interface UpdateNote {
            Id: string,
            Note: string
        }
    
        export interface AddClientNote {
            RecipientCode: string,
            OperatorID: string,
            Note: string,
            NoteType: string
        }
    
        export interface CoordinatorEmail {
            AccountName: string,
            IsRecipient: boolean
        }
    
        export interface EmailAddress {
            Name: string,
            Address: string
        }
    
        export interface EmailMessage {
            ToAddresses?: Array<EmailAddress>,
            FromAddresses?: Array<EmailAddress>,
            Subject?: string,
            Content?: string,
            LeaveType?: string,
            Notes?: string
        }
    
        export interface MiscellaneousNote {
            Note: string,
            UniqueId: string
        }
    
        export interface AttendanceStaff {
            AutoLogout: string,
            EmailMessage: boolean,
            ExcludeShiftAlerts: boolean,
            InAppMessage: boolean,
            LogDisplay: boolean,
            Pin: string,
            RosterPublish: boolean,
            ShiftChange: boolean,
            SmsMessage: boolean,
            Id: string
        }
    
        export interface OutputEmit {
            data: any,
            method: string
        }
    
        export interface FileForm {
            id: number,
            filename: string
        }
    
        export interface DropDowns {
            branchesArr?: Array<string>,
            jobCategoryArr?: Array<string>,
            adminCategoryArr?: Array<string>,
            teamArr?: Array<string>,
            managerArr?: Array<string>,
            serviceRegionArr?: Array<string>,
            indigenousArr?: Array<string>,
            disabilitiesArr?: Array<string>
        }
    
        export interface UserDefinedGroup {
            notes: string,
            group: string,
            personID: string
        }
    
        export interface Reminders {
            recordNumber: number,
            personID?: string,
            name: string,
            address1: string,
            address2: string,
            email: string,
            date1: Date,
            date2: Date,
            state: string,
            notes: string,
            recurring: boolean
        }
    
        export interface Consents {
            recordNumber: number,
            personID?: string,
            name?: string,
            date1?: string,
            notes?: string
        }
    
        export interface IntakeCompetency {
            name: string,
            mandatory: boolean
        }
    
        export interface IntakeServices {
            recordNumber?: number,
            personID?: string,
            serviceType?: string,
            frequency?: number,
            period?: string,
            duration?: number,
            unitType?: string,
            unitBillRate?: number,
            activityBreakDown?: string,
            serviceProgram?: string,
            serviceBiller?: string,
            serviceStatus?: string,
            forceSpecialPrice?: boolean,
            taxRate?: string,
            excludeFromNdiaPriceUpdates?: boolean,
            autoInsertNotes?: boolean,
            humanresources: Array<HumanResources>
        }
    
        export interface HumanResources {
            recordNumber?: number,
            personId?: string,
            type: string,
            name: string,
            address1: string,
            address2: string,
            suburb: string,
            postcode: string,
            phone1: string,
            notes: string,
        }
    
        export interface DateTimeVariables {
            durationStr?: string,
            duration?: number,
            durationInHours?: number,
            quants?: string,
            blockNo?: number,
            error?: boolean
        }
    
        export interface RecipientPrograms {
            recordNumber?: number,
            personID?: string,
            program?: string,
            quantity?: string,
            itemUnit?: string,
            perUnit?: string,
            timeUnit?: string,
            period?: string,
            aP_BasedOn?: string,
            aP_CostType?: string,
            aP_PerUnit?: string,
            aP_Period?: string,
            aP_YellowAmtPerc?: string,
            aP_OrangeAmtPerc?: string,
            aP_RedAmtPerc?: string,
            aP_YellowQty?: string,
            aP_OrangeQty?: string,
            aP_RedQty?: string,
            adminAmount_Perc?: string,
            packageLevel?: string,
            packageTermType?: string,
            priority?: string,
            packageSupplements?: string,
            hardShipSupplement?: string,
            programSummary?: string,
            contingency?: string,
            incomeTestedFee?: string,
            clientCont?: string,
            agreedTopUp?: string,
            dailyIncomeTestedFee?: string,
            dailyBasicCareFee?: string,
            dailyAgreedTopUp?: string,
            commonwealthCont?: string,
            contingency_Start?: string,
            contingency_BuildCycle?: string,
            lastReferrer?: string,
            programStatus?: string,
            billing?: string,
            percentage?: string,
            expiryDate?: Date,
            startDate?: Date,
            deletedRecord?: boolean,
            cappedAt?: number,
            capped?: boolean,
            autoRenew?: boolean,
            RolloverRemainder?: boolean,
            expireUsing?: string,
            reminderProcessed?: boolean,
            renewalProcessed?: boolean,
            reminderDate?: Date,
            reminderLeadTime?: number,
            deactivateOnExpiry?: boolean,
            autoReceipt?: boolean,
            autoBill?: boolean,
            used?: number,
            remaining?: number,
            totalAllocation?: number,
            packageType?: string
        }
    
        export interface AdmitProgram {
            program: string,
            services: Array<any>
        }
    
        export interface AdmitProcedure {
            programs: Array<AdmitProgram>,
            clientCode: string,
            carerCode: string,
            serviceType: string,
            date: string,
            time: string,
            creator: string,
            editer: string,
            billUnit: string,
            agencyDefinedGroup: string,
            referralCode: string,
            timePercentage: string,
            notes: string,
            type: number,
            duration: number,
            blockNo: number,
            reasonType: string,
            tabType: string
            noteDetails: {
                personId: string,
                program: string,
                detailDate: string,
                extraDetail1: string,
                extraDetail2: string,
                whoCode: string,
                publishToApp: number,
                creator: string,
                note: string,
                alarmDate: string,
                reminderTo: boolean
            }
        }
    
        export interface ProcedureRoster {
            clientCode: string,
            carerCode: string,
            serviceType: string,
            date: string,
            time: string,
            creator: string,
            editer: string,
            billUnit: string,
            agencyDefinedGroup: string,
            referralCode: string,
            timePercent: string,
            Notes: string,
            type: number,
            duration: number,
            blockNo: number,
            reasonType: string,
            tabType: string,
            haccType?: string,
            program?: string,
            billTo?: string,
            packageStatus?: string,
    
            costUnit?: string,
            billDesc?: string,
            unitPayRate?: number,
            unitBillRate?: number,
            taxPercent?: number,
            apiInvoiceDate?: string,
            apiInvoiceNumber?: string
        }
    
        export interface ProcedureClientStaffNote {
            personId: string,
            program: string,
            detailDate: string,
            extraDetail1: string
            extraDetail2: string,
            whoCode: string,
            publishToApp: number,
            creator: string,
            note: string,
            alarmDate: string,
            reminderTo: string
        }
    
        export interface ProcedureSetClientPackage {
            packageStatus: string,
            packageName: string,
            clientCode: string
        }
    
        export interface CallProcedure {
            isNDIAHCP: boolean,
            newPackage: string,
            oldPackage: string,
            level: string,
            type: string,
            // clientPackage: ProcedureSetClientPackage,
            roster: Array<ProcedureRoster>,
            staffNote: ProcedureClientStaffNote
        }
    
        export interface CallReferralOutProcedure {
            roster: Array<ProcedureRoster>,
            note: ProcedureClientStaffNote
        }
    
        export interface CallAssessmentProcedure {
            roster: Array<ProcedureRoster>,
            note: ProcedureClientStaffNote
        }
    
        export interface CallDeceaseProcedure {
            roster: Array<ProcedureRoster>,
            note: ProcedureClientStaffNote,
            dateOfDeath: string
        }
    
        export interface CallAdmissionProcedure {
            roster: ProcedureRoster,
            note: ProcedureClientStaffNote,
            program?: string,
            service?: string
        }
    
        export interface ModalVariables {
            title?: string,
            isMultiple?: boolean
        }
    
        export interface ViewTimesheet {
            view: number,
            header: string,
            body: string
        }
    
        export interface ModalVariables {
            title?: string,
            programsArr?: Array<any>,
            referralTypesArr?: Array<string>,
            referralCodeArr?: Array<string>,
            referralSourceArr?: Array<string>,
            reminderToArr?: Array<string>
            wizardTitle?: string
        }
    
        export interface ProfileInterface {
            name: string,
            view: string,
            id?: string,
            sysmgr?: string        
        }
    
        export interface ReportCriteriaInterface {
            states?: string,
            banches?: string,
            regions?: string,
            managers?: string,
            startdate?:string,
            enddate?:string 
        }
    
        export interface User{
            agengyDefinedGroup: string,
            code: string,
            id: string,
            sysmgr: boolean,
            view: string
        }
        
        // export interface NewStaffUser {
        //     type?: number,
        //     individualOrg?: string,
        //     surnameOrg?: string,
        //     firstName?: string,
        //     gender?: string,
        //     birthDate?: string,
        //     residentialAddress?: string,
        //     postalAddress?: string,
        //     phone
        // }    

}
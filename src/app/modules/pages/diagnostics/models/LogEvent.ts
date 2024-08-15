import moment from 'moment'

export interface ILogEvent {
    ID?: number,
    ProcessId?: number
    System?: string
    Function?: string
    Who?: string
    When?: Date | null
    Description?: string
    Result?: string
}

export class LogEvent implements ILogEvent {
    public When: Date | null

    constructor(
        public ID?: number,
        public ProcessId?: number,
        public System?: string,
        public Function?: string,
        public Who?: string,
        private DateStamp?: any,
        public Description?: string,
        public Result?: string,
    ) {
        moment.locale('en-EN')
        this.When = moment(DateStamp).isValid() ? moment(DateStamp).toDate() : null
    }
}
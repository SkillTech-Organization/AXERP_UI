import moment from 'moment'

export interface IAppInsightsEntry {
    TimeStamp: Date | null
    RowNum: string
    Message: string
}

export class AppInsightsEntry implements IAppInsightsEntry {
    public TimeStamp: Date | null

    constructor(
        public RowNum: string,
        public Message: string,
        private DateStamp: any
    ) {
        moment.locale('en-EN')
        this.TimeStamp = moment(DateStamp).isValid() ? moment(DateStamp).toDate() : null
    }
}
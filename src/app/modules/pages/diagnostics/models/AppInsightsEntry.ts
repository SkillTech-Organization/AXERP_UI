import moment from 'moment'

export interface IAppInsightsEntry {
    RowNum: number
    Message: string
    TimeStamp: Date | null
}

export class AppInsightsEntry implements IAppInsightsEntry {
    public TimeStamp: Date | null

    constructor(
        public RowNum: number,
        public Message: string,
        private DateStamp: any
    ) {
        moment.locale('en-EN')
        this.TimeStamp = moment(DateStamp).isValid() ? moment(DateStamp).toDate() : null
    }
}
import moment from 'moment'

export interface IGasTransaction {
    DeliveryID: string
    DateLoadedEnd: Date | null
    DateDelivered: Date | null
    SalesContractID: string | null
    SalesStatus: string | null
    Terminal: string | null
    QtyLoaded: number | null
    StockDays: number | null
    SlotBookedByAXGTT: number | null
    ToDeliveryID: number | null
    Status: string | null
    SpecificDeliveryPoint: string | null
    DeliveryPoint: string | null
    Transporter: string | null
    DeliveryUP: number | null
    TransportCharges: number | null
    UnitSlotCharge: number | null
    ServiceCharges: number | null
    UnitStorageCharge: number | null
    StorageCharge: number | null
    OtherCharges: number | null
    Sales: number | null
    CMR: Date | null
    BioMWh: number | null
    BillOfLading: Date | null
    BioAddendum: string | null
    Comment: string | null
    CustomerNote: string | null
    Customer: string | null
    Reference: string | null
    Reference2: string | null
    Reference3: string | null
    BLFilename: string | null
    TruckLoadingCompanyComment: string | null
    TruckCompany: string | null
}

export class GasTransaction implements IGasTransaction {
    public DateLoadedEnd: Date | null
    public DateDelivered: Date | null
    public CMR: Date | null
    public BillOfLading: Date | null

    constructor(
        public DeliveryID: string,
        private _DateLoadedEnd: any,
        private _DateDelivered: any,
        public SalesContractID: string | null,
        public SalesStatus: string | null,
        public Terminal: string | null,
        public QtyLoaded: number | null,
        public StockDays: number | null,
        public SlotBookedByAXGTT: number | null,
        public ToDeliveryID: number | null,
        public Status: string | null,
        public SpecificDeliveryPoint: string | null,
        public DeliveryPoint: string | null,
        public Transporter: string | null,
        public DeliveryUP: number | null,
        public TransportCharges: number | null,
        public UnitSlotCharge: number | null,
        public ServiceCharges: number | null,
        public UnitStorageCharge: number | null,
        public StorageCharge: number | null,
        public OtherCharges: number | null,
        public Sales: number | null,
        private _CMR: any,
        public BioMWh: number | null,
        private _BillOfLading: any,
        public BioAddendum: string | null,
        public Comment: string | null,
        public CustomerNote: string | null,
        public Customer: string | null,
        public Reference: string | null,
        public Reference2: string | null,
        public Reference3: string | null,
        public BLFilename: string | null,
        public TruckLoadingCompanyComment: string | null,
        public TruckCompany: string | null,
    ) {
        moment.locale('en-EN')

        // TODO: avoid client-side conversion

        this.DateLoadedEnd = moment(_DateLoadedEnd).isValid() ? moment(_DateLoadedEnd).toDate() : null
        this.DateDelivered = moment(_DateDelivered).isValid() ? moment(_DateDelivered).toDate() : null
        
        this.CMR = moment(_CMR).isValid() ? moment(_CMR).toDate() : null
        
        this.BillOfLading = moment(_BillOfLading).isValid() ? moment(_BillOfLading).toDate() : null
    }
}

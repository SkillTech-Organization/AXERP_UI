export interface IGasTransaction {
    DeliveryID: string;
    DateLoadedEnd: string | null;
    DateDelivered: string | null;
    SalesContractID: string;
    SalesStatus: string;
    Terminal: string;
    QtyLoaded: number | null;
    ToDeliveryID: number | null;
    Status: string;
    SpecificDeliveryPoint: string;
    DeliveryPoint: string;
    Transporter: string;
    DeliveryUP: number | null;
    TransportCharges: number | null;
    UnitSlotCharge: number | null;
    ServiceCharges: number | null;
    UnitStorageCharge: number | null;
    StorageCharge: number | null;
    OtherCharges: number | null;
    Sales: number | null;
    CMR: string | null;
    BioMWh: number | null;
    BillOfLading: string | null;
    BioAddendum: string;
    Comment: string;
    CustomerNote: string;
    Customer: string;
    Reference: string;
    Reference2: string;
    Reference3: string;
    TruckLoadingCompanyComment: string;
    TruckCompany: string;
}

export class GasTransaction implements IGasTransaction {
    constructor(
        public DeliveryID: string,
        public DateLoadedEnd: string | null,
        public DateDelivered: string | null,
        public SalesContractID: string,
        public SalesStatus: string,
        public Terminal: string,
        public QtyLoaded: number | null,
        public ToDeliveryID: number | null,
        public Status: string,
        public SpecificDeliveryPoint: string,
        public DeliveryPoint: string,
        public Transporter: string,
        public DeliveryUP: number | null,
        public TransportCharges: number | null,
        public UnitSlotCharge: number | null,
        public ServiceCharges: number | null,
        public UnitStorageCharge: number | null,
        public StorageCharge: number | null,
        public OtherCharges: number | null,
        public Sales: number | null,
        public CMR: string | null,
        public BioMWh: number | null,
        public BillOfLading: string | null,
        public BioAddendum: string,
        public Comment: string,
        public CustomerNote: string,
        public Customer: string,
        public Reference: string,
        public Reference2: string,
        public Reference3: string,
        public TruckLoadingCompanyComment: string,
        public TruckCompany: string,
    ) {

    }
}

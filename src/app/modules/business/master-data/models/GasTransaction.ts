export class GasTransaction {
    constructor(
        public TransactionType: string,
        public ID: string,
        public TransactionStart: Date,
        public TransactionComplete: Date,
        public Location: string,
        public Counterparty: string,
        public GasType: string,
        public UOM: string,
        public QTYHHV: number,
        public Comments: string,
        public DocRef: string,
        public DocRef2: string,
        public DocRef3: string,
        public ExternalID: string
    ) {

    }
}
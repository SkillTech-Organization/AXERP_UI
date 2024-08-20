import { BlobFile } from "./BlobFile";

export class BlobUploadFile extends BlobFile {
    constructor(
        FileName: string,
        Folder: string = "",
        public Content: File
    ) {
        super(FileName, Folder)
    }
}


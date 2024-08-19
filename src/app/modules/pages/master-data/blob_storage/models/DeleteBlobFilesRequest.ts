import { BlobFile } from "./BlobFile";

export class DeleteBlobFilesRequest {
    constructor(public Items: BlobFile[]) {}
}

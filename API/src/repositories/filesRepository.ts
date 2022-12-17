import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import config from '../config/index.js';
import { Readable } from 'stream';

export default class FilesRepository {
  private readonly containerClient: ContainerClient;
  constructor() {
    const blobServiceClient = BlobServiceClient.fromConnectionString(config.blobStorage.connectionString);
    this.containerClient = blobServiceClient.getContainerClient(config.blobStorage.containerName);
  }

  async upload(fileName: string, type: string, fileContent: Readable) {
    const filePath = `${config.appName}/${encodeURIComponent(fileName)}`;
    const blobClient = this.containerClient.getBlockBlobClient(filePath);
    await blobClient.uploadStream(fileContent, undefined, undefined, {
      blobHTTPHeaders: {
        blobContentType: type,
      },
    });
    return blobClient.url;
  }
}

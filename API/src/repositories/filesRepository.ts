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
    const path = fileName.split('/');
    fileName = path[path.length - 1];
    const folder = path.slice(0, path.length - 1).join('/');
    const filePath = `${config.appName}/${folder}/${encodeURIComponent(fileName)}`;
    const blobClient = this.containerClient.getBlockBlobClient(filePath);
    await blobClient.uploadStream(fileContent, undefined, undefined, {
      blobHTTPHeaders: {
        blobContentType: type,
      },
    });
    return blobClient.url;
  }
}

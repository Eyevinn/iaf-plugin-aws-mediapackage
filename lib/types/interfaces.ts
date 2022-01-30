import { Readable } from "stream";
import { Logger } from "eyevinn-iaf";

export interface Uploader {
  destination: string;
  logger: Logger;
  upload(fileStream: Readable, fileName: String)
}

export interface TranscodeDispatcher {
  packagingGroupId: any;
  roleArn: string;
  logger: Logger;
  dispatch(sourceArn: string): Promise<any>;
}

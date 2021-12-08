import { Readable } from "stream";
import winston from "winston";

export interface Uploader {
  destination: string;
  logger: winston.Logger;
  upload(fileStream: Readable, fileName: String)
}

export interface TranscodeDispatcher {
  packagingGroupId: any;
  roleArn: string;
  logger: winston.Logger;
  dispatch(sourceArn: string): Promise<any>;
}

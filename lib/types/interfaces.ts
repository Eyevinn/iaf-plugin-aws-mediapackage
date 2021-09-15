import { Readable } from "stream";
import winston from "winston";

export interface IafUploadModule {
    logger: winston.Logger;
    playlistName: string;
    onFileAdd(filePath: string, readStream: Readable): any;
    fileUploadedDelegate: Function;
}

export interface Uploader {
    destination: string;
    logger: winston.Logger;
    upload(fileStream: Readable, fileName: String)
}

export interface TranscodeDispatcher {
    packagingGroupId: any;
    sourceArn: string;
    logger: winston.Logger;
    dispatch(fileName: string): Promise<any>;
}

export interface FileWatcher {
    dirName: String;
    logger: winston.Logger;
    onAdd(callback: (filePath: string, readStream: Readable) => any);
}
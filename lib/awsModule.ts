import winston from "winston";
import * as path from 'path'
import { IafUploadModule } from './types/interfaces'
import { MediaPackageDispatcher } from "./mediaPackageDispatcher";
import { Readable } from "stream";

export class AwsUploadModule implements IafUploadModule {
    logger: winston.Logger;
    playlistName: string;
    dispatcher: MediaPackageDispatcher;
    fileUploadedDelegate: Function;


    constructor(mediaPackagerEndpoint: string, awsRegion: string, sourceArn: string, roleArn: string, packagingGroupId: string, logger: winston.Logger) {
        this.logger = logger;
        this.dispatcher = new MediaPackageDispatcher(mediaPackagerEndpoint, awsRegion, roleArn, packagingGroupId, this.logger);
    }

    /**
     * Method that runs when a FileWatcher detects a new file.
     * Uploads the file to an S3 ingress bucket, and dispatches a transcoding job when
     * the upload is completed.
     * @param sourceArn The ARN for the source content in Amazon S3
     */
    onFileAdd = (sourceArn: string) => {
        try {
            this.dispatcher.dispatch(sourceArn).then((result) => {
                this.fileUploadedDelegate(result);
            });
        }
        catch (err) {
            this.logger.log({
                level: "Error",
                message: `Error when attempting to process file: ${sourceArn}. Full error: ${err}`,
            })
        }
    }
}
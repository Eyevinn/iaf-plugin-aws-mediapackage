import winston from "winston";
import { IafUploadModule } from './types/interfaces'
import { MediaPackageDispatcher } from "./mediaPackageDispatcher";
import { Readable } from "stream";

export class AwsUploadModule implements IafUploadModule {
  logger: winston.Logger;
  playlistName: string;
  dispatcher: MediaPackageDispatcher;
  fileUploadedDelegate: Function;


  constructor(mediaPackagerEndpoint: string, awsRegion: string, roleArn: string, packagingGroupId: string, logger: winston.Logger) {
    this.logger = logger;
    this.dispatcher = new MediaPackageDispatcher(mediaPackagerEndpoint, awsRegion, roleArn, packagingGroupId, this.logger);
  }

  /**
   * Method that runs when a file is added an S3 bucket.
   * Adds the file to the MediaPackage Dispatcher.
   * @param filePath The ARN for the source content in Amazon S3
   */
  onFileAdd = (filePath: string, readStream: Readable) => {
    try {
      this.dispatcher.dispatch(filePath).then((result) => {
        this.fileUploadedDelegate(result);
      });
    }
    catch (err) {
      this.logger.log({
        level: "Error",
        message: `Error when attempting to process file: ${filePath}. Full error: ${err}`,
      })
    }
  }
}
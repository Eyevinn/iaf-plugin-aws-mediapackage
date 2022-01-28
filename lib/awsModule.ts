import { MediaPackageDispatcher } from "./mediaPackageDispatcher";
import { Readable } from "stream";
import { IafUploadModule, Logger } from "eyevinn-iaf";

export class AwsUploadModule implements IafUploadModule {
  logger: Logger;
  playlistName: string;
  dispatcher: MediaPackageDispatcher;
  fileUploadedDelegate: (result: any, error?: any) => any;
  progressDelegate: (result: any) => any;


  constructor(roleArn: string, packagingGroupId: string, logger: Logger) {
    this.logger = logger;
    this.dispatcher = new MediaPackageDispatcher(roleArn, packagingGroupId, this.logger);
  }

  /**
   * Method that runs when a file is added an S3 bucket.
   * Adds the file to the MediaPackage Dispatcher.
   * @param filePath The ARN for the source content in Amazon S3
   */
  onFileAdd = (filePath: string, readStream: Readable) => {
    try {
      this.dispatcher.dispatch(filePath).then((result) => {
        if (result['resp'] === null) {
          this.fileUploadedDelegate(null, result['error']);
        } else {
          this.fileUploadedDelegate(result['resp']);
        }
      });
    }
    catch (err) {
      this.logger.error(`Error when attempting to process file: ${filePath}. Full error: ${err}`);
    }
  }
}
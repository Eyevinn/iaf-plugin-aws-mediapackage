import { MediaPackageVodClient, CreateAssetCommand } from "@aws-sdk/client-mediapackage-vod";
import { TranscodeDispatcher } from './types/interfaces'
import { v4 as uuidv4 } from 'uuid';
import { Logger } from "eyevinn-iaf";


export class MediaPackageDispatcher implements TranscodeDispatcher {
  packagingGroupId: any;
  mediaPackagerEndpoint: any;
  mediaPackageClient: MediaPackageVodClient;
  roleArn: string;
  logger: Logger;

  /**
   * Initializes a MediaConvertDispatcher
   * @param roleArn the role ARN string for AWS
   * @param packagingGroupId the packaging group id associated with this asset
   * @param logger a logger object
   */
  constructor (roleArn: string, packagingGroupId: string, logger: Logger) {
      this.roleArn = roleArn;
      this.logger = logger;
      this.packagingGroupId = packagingGroupId;
      this.mediaPackageClient = new MediaPackageVodClient({});
  }

  /**
   * Dispatches a re-packaging job to a MediaPackage instance
   * @param sourceArn The ARN for the source content in Amazon S3
   * @returns The response from AWS including the egressEndpoints if successful.
   */
  async dispatch(sourceArn: string): Promise<any> {
    if (!sourceArn) {
      this.logger.error("sourceArn is required!");
      return null;
    }
    const assetConfig = {
      Id: uuidv4(),
      PackagingGroupId: this.packagingGroupId,
      SourceArn: sourceArn,
      ResourceId: uuidv4(),
      SourceRoleArn: this.roleArn,
      Tags: {}
    };
    try {
      const config = new CreateAssetCommand(assetConfig);
      const data = await this.mediaPackageClient.send(config);
      this.logger.info(`MediaPackage job created for ${sourceArn}. ID: ${data.Id}`);
      return { resp: data };
    }
    catch (err) {
      this.logger.error(`Failed to create a MediaPackage job for ${sourceArn}!`);
      return {resp: null, error: err};
    }
  }
}
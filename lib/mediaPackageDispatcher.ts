import { MediaPackageVodClient, CreateAssetCommand } from "@aws-sdk/client-mediapackage-vod";
import winston from "winston";
import { TranscodeDispatcher } from './types/interfaces'
import { v4 as uuidv4 } from 'uuid';


export class MediaPackageDispatcher implements TranscodeDispatcher {
    packagingGroupId: any;
    mediaPackagerEndpoint: any;
    mediaPackageClient: MediaPackageVodClient;
    roleArn: string;
    logger: winston.Logger;

    /**
     * Initializes a MediaConvertDispatcher
     * @param mediaPackagerEndpoint the unique part of the endpoint to the mediaPackage instance
     * @param region the AWS region
     * @param roleArn the role ARN string for AWS
     * @param packagingGroupId the packaging group id associated with this asset
     * @param logger a logger object
     */
    constructor (mediaPackagerEndpoint: string, region: string, roleArn: string, packagingGroupId: string, logger: winston.Logger) {
        this.roleArn = roleArn;
        this.packagingGroupId = packagingGroupId;
        this.logger = logger;
        this.mediaPackagerEndpoint = {
            endpoint: `https://${mediaPackagerEndpoint}.mediapackage.${region}.amazonaws.com`
        }
        this.mediaPackageClient = new MediaPackageVodClient(this.mediaPackagerEndpoint);
    }

    /**
     * Dispatches a re-packaging job to a MediaPackage instance
     * @param sourceArn The ARN for the source content in Amazon S3
     * @returns The response from AWS including the egressEndpoints if successful.
     */
    async dispatch(sourceArn: string): Promise<any> {
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
            this.logger.log({
                level: 'info',
                message: `MediaPackage job created for ${sourceArn}. ${data.Id}`
            })
            return data;
        }
        catch (err) {
            this.logger.log({
                level: 'error',
                message: `Failed to create a MediaPackage job for ${sourceArn}!`
            })
            throw err;
        }
    }

}
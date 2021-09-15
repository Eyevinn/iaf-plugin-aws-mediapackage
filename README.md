# IAF Plugin AWS MediaPackage

The Eyevinn Ingest Application Framework (Eyevinn IAF) is a framework to simplify building VOD ingest applications. A framework of open source plugins to integrate with various transcoding and streaming providers. This is the plugin for just-in-time video packaging of files from an S3 bucket.

## Installation

To install the plugin in your project, run the following command.

```
npm install --save @eyevinn/iaf-plugin-aws-mediapackage
```

## Using the module in your application based on Eyevinn IAF

To use the AWS upload module in your Eyevinn IAF setup, your `index.ts` should look like this:

```TypeScript
// other imports
import {AWSUploadModule} from "@eyevinn/iaf-plugin-aws-mediapackage";

const awsUploader = new AWSUploadModule(/** args **/);
const fileWatcher = /** initialize your file watcher of choice**/

fileWatcher.onAdd(awsUploader.onFileAdd);
```

# Plugin Documentation

## `AWSUploadModule`
Default plugin export. This class is plug-and-play with the Ingest Application Framework, as described in the previous section.

### Methods
`constructor(mediaPackagerEndpoint: string, awsRegion: string, roleArn: string, packagingGroupId: string, logger: winston.Logger)`

Creates a new `AWSUploadModule` object. You need to provide the unique part your mediaPackage endpoint URL, which AWS region it is running in. You will also need to provide a role ARN, as well as the MediaPackage `packagingGroupId`. A winston logger is also needed. These parameters are used to initialize the sub-modules.

`onFileAdd = (filePath: string, readStream: Readable)`.

Method that is executed when a file is added to the directory being watched. `fileName` is the source ARN of the file in the S3 bucket that MediaPackage will repackage, and `readStream` is a `Readable` stream of the file data. Any file watcher plugins are *required* to provide these. The method dispatches a repackaging job to the MediaPackage endpoint.

## `MediaPackageDispatcher`
Sub-module that dispatches MediaPackage video packaging jobs.

### Methods
`constructor(mediaPackagerEndpoint: string, region: string, roleArn: string, packagingGroupId: string, logger: winston.Logger)`

Instantiates a new `MediaPackageDispatcher`. logging is injected in order to avoid multiple logging objects.
In most cases, the parameters will be passed down to the parent `AwsUploadModule`.

`async dispatch(sourceArn: string)`

Dispatches a MediaPackage repackaging job. Jobs are executed with the settings specified in `packagingGroup` defined by the `packagingGroupId`. `sourceArn` is the S3 source ARN for the input file.
# [Contributing](CONTRIBUTING.md)

In addition to contributing code, you can help to triage issues. This can include reproducing bug reports, or asking for vital information such as version numbers or reproduction instructions.

# License (MIT)

Copyright 2021 Eyevinn Technology

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# About Eyevinn Technology

Eyevinn Technology is an independent consultant firm specialized in video and streaming. Independent in a way that we are not commercially tied to any platform or technology vendor.

At Eyevinn, every software developer consultant has a dedicated budget reserved for open source development and contribution to the open source community. This give us room for innovation, team building and personal competence development. And also gives us as a company a way to contribute back to the open source community.

Want to know more about Eyevinn and how it is to work here. Contact us at work@eyevinn.se!


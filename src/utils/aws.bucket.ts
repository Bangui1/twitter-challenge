import { S3Client } from '@aws-sdk/client-s3'
import { Constants } from '@utils'

export const s3Client = new S3Client({
  region: Constants.AWS_REGION,
  credentials: {
    accessKeyId: Constants.AWS_ACCESS_KEY_ID,
    secretAccessKey: Constants.AWS_SECRET_ACCESS_KEY
  }
})

PixelPress Database Backup
==========================

Backs up one MonogoDB server, once daily at midnight server-time.

Designed to be deployed via Docker, specifically for AWS ElasticBeanstalk.

## Environment Variables

- `AWS_AKID` - AWS Access Key ID (credential)
- `AWS_SECRET` - AWS Secret Access Key (credential)
- `DB_HOST` - Host name/IP of database to backup
- `AWS_S3_BACKUP_BUCKET` - S3 Bucket in which to store backups.
- `AWS_BUCKET_SUBFOLDER`- **Optional** Subfolder to store the backups within the bucket. Defaults to none, which will dump directly into the S3 bucket.
- `MONGODUMP_LOCATION` - **Optional** How do we invoke `mongodump`? Defaults to `mongodump`, which requires that to be available on your path variable.
- `CRON_SCHEDULE` - **Optional** When should this try to backup the db? Uses cron format. Defaults to `0 20 * * *`

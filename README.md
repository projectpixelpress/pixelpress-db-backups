PixelPress Database Backup
==========================

Backs up one MonogoDB server, once daily at midnight server-time.

Designed to be deployed on AWS ElasticBeanstalk.

## Environment Variables

- `AWS_AKID` - AWS Access Key ID (credential)
- `AWS_SECRET` - AWS Secret Access Key (credential)
- `DB_HOST` - Host name/IP of database to backup
- `AWS_S3_BACKUP_BUCKET` - S3 Bucket in which to store backups.
- `AWS_BUCKET_SUBFOLDER`- **Optional** Subfolder to store the backups within the bucket. Defaults to none, which will dump directly into the S3 bucket.
- `MONGODUMP_LOCATION` - **Optional** How do we invoke `mongodump`? Defaults to `mongodump`, which requires that to be available on your path variable.
- `CRON_SCHEDULE` - **Optional** When should this try to backup the db? Uses cron format. Defaults to `0 20 * * *`

## Endpoints

In addition to the cron functionality, this server also exposes some endpoints:

- `GET /backup` - Returns information on the last backup run
- `POST /backup` - Kicks off a backup

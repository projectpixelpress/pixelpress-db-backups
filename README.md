PixelPress Database Backup
==========================

Backs up one MonogoDB server.

Designed to be deployed via Docker, specifically for AWS ElasticBeanstalk.

## Environment Variables

- `AWS_AKID` - AWS Access Key ID (credential)
- `AWS_SECRET` - AWS Secret Access Key (credential)
- `DB_HOST` - Host name/IP of database to backup
- `AWS_S3_BACKUP_BUCKET` - S3 Bucket in which to store backups.
- `AWS_BUCKET_SUBFOLDER`- **Optional** Subfolder to store the backups within the bucket.

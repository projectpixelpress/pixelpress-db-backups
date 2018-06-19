#!/bin/bash

# * create a directory for the backup
# * backup all the things
# * tar up the dump
# * copy everything to s3
# * remove dump directory and file (maybe keep 1 backup?)

db_server=xxx.xxx.xxx.xxx

backup_dir=/backups # backups get stored here
curr_date=`date +%m%d%Y`
current_dir=${backup_dir}/${curr_date}
backup_file=${curr_date}_db_backup.tgz
bucket="xxxxxxxxxxx"
# * create a directory for the backup
mkdir -p $current_dir 2>&1 > /dev/null
cd $current_dir

# * backup all the things
#/usr/bin/mongodump --host $db_server 2>&1 > /dev/null # ssssshhhhhhhhh.. quiet
/usr/bin/mongodump --gzip --host $db_server 2>&1 > /dev/null # ssssshhhhhhhhh.. quiet
if [ "$?" != "0" ]; then #backup failed
echo "mongodump command failed"
exit 1
fi
# * tar up the dump
tar vvczf ${backup_file} * 2>&1 > /dev/null
if [ "$?" != "0" ]; then #backup failed
echo "tar command failed"
exit 1
fi
# * copy everything to s3
s3cmd put ${backup_file} ${bucket} > /dev/null 2>&1
if [ "$?" != "0" ]; then #backup failed
echo "s3 copy command failed"
exit 1
fi
# * remove dump directory and file (maybe keep 1 backup?)
rm -rf $current_dir 2>&1 > /dev/null

echo backup for ${curr_date} complete

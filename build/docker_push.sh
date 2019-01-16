#!/bin/bash
branch=$1
if [ $branch = "develop" ]
then
  docker push qiansy/ebackup:dev-latest
elif [ $branch = "master" ]
then
  docker push qiansy/ebackup:latest
elif [ $branch = "disaster-recover" ]
then
  docker push qiansy/ebackup:disaster-recover
elif [ $branch = "version2.3" ]
then
  docker push qiansy/ebackup:version2.3
elif [ $branch = "v2.4.3" ]
then
  docker push qiansy/ebackup:v2.4.3
fi

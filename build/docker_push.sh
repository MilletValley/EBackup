#!/bin/bash
branch=$1
if [ $branch = "develop" ]
then
  docker push qiansy/ebackup:dev-latest
elif [ $branch = "master" ]
then
  docker push qiansy/ebackup:latest
elif [ $branch = "test" ]
then
  docker push qiansy/ebackup:test
elif [ $branch = "version2.3" ]
then
  docker push qiansy/ebackup:version2.3
fi

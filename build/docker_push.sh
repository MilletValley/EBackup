#!/bin/bash
branch=$1
if [ $branch = "develop" ]
then
  docker push qiansy/ebackup:dev-latest
elif [ $branch = "master" ]
then
  docker push qiansy/ebackup:latest
elif [ $branch = "v3.2" ]
then
  docker push qiansy/ebackup:v3.2
fi

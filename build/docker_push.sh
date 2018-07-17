#!/bin/bash
branch=$1
if [ $branch = "develop" ]
then
  docker push qian-sy/ebackup:dev-latest
elif [ $branch = "master" ]
then
  docker push qian-sy/ebackup:latest
fi

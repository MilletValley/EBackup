#!/bin/bash
branch=$1
if [ $branch = "develop" ]
then
  docker push gw920529/ebackup:dev-latest
elif [ $branch = "master" ]
then
  docker push gw920529/ebackup:latest
fi

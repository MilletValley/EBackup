#!/bin/bash
branch=$1
if [ $branch = "develop" ]
then
  docker push chenzhq/ebackup:dev-latest
elif [ $branch = "master" ]
then
  docker push chenzhq/ebackup:latest
fi
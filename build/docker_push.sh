#!/bin/bash
branch=$1
if [ $branch = "develop" ]
then
  docker push gw920529/ebackup:dev-latest
elif [ $branch = "master" ]
then
  docker push gw920529/ebackup:latest
elif [ $branch = "devolop-9.29" ]
then
  docker tag gw920529/ebackup:dev-latest gw920529/ebackup:dev-9.29-latest
  docker push gw920529/ebackup:dev-9.29-latest
elif [ $branch = "version2.3" ]
then
  docker tag gw920529/ebackup:dev-latest gw920529/ebackup:v2.3-latest
  docker push gw920529/ebackup:v2.3-latest
elif [ $branch = "version2.4" ]
then
  docker tag gw920529/ebackup:dev-latest gw920529/ebackup:v2.4-latest
  docker push gw920529/ebackup:v2.4-latest
fi

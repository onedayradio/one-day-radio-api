#!/bin/bash
# setup-es.sh

echo 'seeding data into our database...'

mongoimport --host mongodb --port 27017 --db onedayradio --username onedayradio-admin --password password --authenticationDatabase admin --collection users --type json --file data/users.json --jsonArray

echo 'data seeding complete...'

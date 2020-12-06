#!/bin/bash
# setup-es.sh

echo 'seeding data into our neo4j database...'

set -euo pipefail

for f in seed-data/*.cyp; do
    echo "running cypher ${f}"
    cypher-shell --address neo4j://neo4j:7687 --username neo4j --password test --file $f
done

FROM neo4j:latest
COPY ./neo4j-seed.sh neo4j-seed.sh
COPY ./wait-for-it.sh wait-for-it.sh
RUN mkdir seed-data
COPY ./data/* seed-data/
RUN chmod +x neo4j-seed.sh
RUN chmod +x wait-for-it.sh

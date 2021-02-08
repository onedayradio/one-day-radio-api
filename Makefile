# ----------------------------
# RUNNING PROJECT LOCALLY
# ----------------------------

local: setup-local-db
	yarn
	yarn start

# ----------------------------
# PRELOADING NEO4J DATABASE
# ----------------------------

preload-neo4j-watch: setup-local-db
	export DOTENV_CONFIG_PATH=./scripts/.env; yarn preload-neo4j-watch

# ----------------------------
# SETTING UP LOCAL DATABASE
# ----------------------------

setup-local-db: docker-compose-down init
	docker-compose up --build neo4j-seed

# ----------------------------
# DOCKER COMMANDS
# ----------------------------

docker-clean-up:
	docker stop neo4j || true
	docker stop neo4j-seed || true
	docker rm -v $(shell docker ps -a -q -f status=exited) 2>&1 || true
	docker rmi $(shell docker images -f "dangling=true" -q) 2>&1 || true
	docker rm neo4j || true
	docker rm neo4j-seed || true
	docker volume prune -f

docker-compose-down: docker-clean-up
	docker-compose down --remove-orphans

# ----------------------------
# UTILITY FUNCTIONS
# ----------------------------

init:
	$(call create_network)

define create_network
	docker network create onedayradio || true
endef

define run_docker_logs
	docker-compose logs -f neo4j-seed
endef

# ----------------------------
# MAKE TARGETS
# ----------------------------

.PHONY: docker-compose-down docker-clean-up init setup-local-db

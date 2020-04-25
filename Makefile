# ----------------------------
# RUNNING PROJECT LOCALLY
# ----------------------------

local: setup-local-db
	yarn
	yarn start

# ----------------------------
# SETTING UP LOCAL DATABASES
# ----------------------------

setup-local-db: docker-compose-down init
	docker-compose up --build -d mongo-seed
	$(call run_docker_logs)

# ----------------------------
# DOCKER COMMANDS
# ----------------------------

docker-clean-up:
	docker stop mongodb || true
	docker stop mongo-seed || true
	docker rm -v $(shell docker ps -a -q -f status=exited) 2>&1 || true
	docker rmi $(shell docker images -f "dangling=true" -q) 2>&1 || true
	docker rm mongodb || true
	docker rm mongo-seed || true
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
	docker-compose logs -f mongo-seed
endef

# ----------------------------
# MAKE TARGETS
# ----------------------------

.PHONY: docker-compose-down docker-clean-up init setup-local-db

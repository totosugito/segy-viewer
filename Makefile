# Nama file docker-compose
COMPOSE_FILE=docker-compose.yaml

# Jalankan semua service
run:
	docker compose -f $(COMPOSE_FILE) up -d --build

# Stop semua service
stop:
	docker compose -f $(COMPOSE_FILE) down

# Hapus semua container & volume (jika perlu)
delete:
	docker compose -f $(COMPOSE_FILE) down --volumes --remove-orphans

# Hapus semua image yang dibuat dari compose
delete-images:
	docker image rm segy-viewer-backend:beta || true
	docker image rm frontend:latest || true

# Full reset: stop, delete, remove images
reset: stop delete delete-images


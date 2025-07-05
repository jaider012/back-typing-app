# Health Check System

Este sistema de health check proporciona múltiples endpoints para monitorear el estado de la aplicación.

## Endpoints Disponibles

### 1. Health Check Completo
```
GET /api/health
```
Realiza un health check completo del sistema incluyendo:
- Conexión a Firebase (Auth y Firestore)
- Uso de memoria (heap y RSS)
- Uso de disco

**Respuesta exitosa:**
```json
{
  "status": "ok",
  "info": {
    "firebase": {
      "status": "up",
      "auth": "connected",
      "firestore": "connected",
      "timestamp": "2024-01-01T00:00:00.000Z"
    },
    "memory_heap": {
      "status": "up"
    },
    "memory_rss": {
      "status": "up"
    },
    "storage": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "firebase": {
      "status": "up",
      "auth": "connected",
      "firestore": "connected",
      "timestamp": "2024-01-01T00:00:00.000Z"
    },
    "memory_heap": {
      "status": "up"
    },
    "memory_rss": {
      "status": "up"
    },
    "storage": {
      "status": "up"
    }
  }
}
```

### 2. Health Check Simple
```
GET /api/health/simple
```
Retorna información básica del sistema de forma rápida.

**Respuesta:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0",
  "memory": {
    "used": 45.67,
    "total": 89.23
  }
}
```

### 3. Health Check Detallado
```
GET /api/health/detailed
```
Proporciona información detallada del sistema incluyendo CPU, memoria y información del proceso.

**Respuesta:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0",
  "system": {
    "platform": "darwin",
    "arch": "arm64",
    "nodeVersion": "v18.17.0",
    "pid": 12345
  },
  "memory": {
    "rss": 89.23,
    "heapTotal": 67.45,
    "heapUsed": 45.67,
    "external": 12.34,
    "arrayBuffers": 5.67
  },
  "cpu": {
    "user": 123456,
    "system": 78901
  }
}
```

### 4. Métricas del Sistema
```
GET /api/metrics
```
Retorna métricas detalladas del sistema para monitoreo.

**Respuesta:**
```json
{
  "uptime": {
    "seconds": 3600,
    "human": "1h 0m 0s"
  },
  "requests": {
    "total": 1234,
    "errors": 12,
    "successRate": "99.03%"
  },
  "memory": {
    "rss": "89MB",
    "heapTotal": "67MB",
    "heapUsed": "46MB",
    "external": "12MB",
    "heapUsedPercentage": "68%"
  },
  "cpu": {
    "user": 123456,
    "system": 78901
  },
  "process": {
    "pid": 12345,
    "platform": "darwin",
    "arch": "arm64",
    "nodeVersion": "v18.17.0"
  },
  "environment": {
    "nodeEnv": "development",
    "port": 3001
  }
}
```

### 5. Métricas Prometheus
```
GET /api/metrics/prometheus
```
Retorna métricas en formato Prometheus para integración con sistemas de monitoreo.

**Respuesta:**
```
# HELP nodejs_memory_usage_bytes Memory usage in bytes
# TYPE nodejs_memory_usage_bytes gauge
nodejs_memory_usage_bytes{type="rss"} 93634560
nodejs_memory_usage_bytes{type="heapTotal"} 70778880
nodejs_memory_usage_bytes{type="heapUsed"} 47890432
nodejs_memory_usage_bytes{type="external"} 12934144

# HELP nodejs_process_uptime_seconds Process uptime in seconds
# TYPE nodejs_process_uptime_seconds counter
nodejs_process_uptime_seconds 3600

# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total 1234

# HELP http_errors_total Total number of HTTP errors
# TYPE http_errors_total counter
http_errors_total 12
```

## Códigos de Estado HTTP

- **200 OK**: Todos los checks pasaron exitosamente
- **503 Service Unavailable**: Uno o más checks fallaron

## Uso Recomendado

### Para Desarrollo
```bash
# Check rápido
curl http://localhost:3001/api/health/simple

# Check completo
curl http://localhost:3001/api/health
```

### Para Producción
```bash
# Monitoreo con Prometheus
curl http://localhost:3001/api/metrics/prometheus

# Health check para load balancer
curl http://localhost:3001/api/health/simple
```

### Para Debugging
```bash
# Información detallada del sistema
curl http://localhost:3001/api/health/detailed

# Métricas completas
curl http://localhost:3001/api/metrics
```

## Integración con Docker

Puedes usar estos endpoints en tu `Dockerfile` para health checks:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health/simple || exit 1
```

## Integración con Kubernetes

Para Kubernetes, puedes configurar liveness y readiness probes:

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: typing-app
    image: typing-app:latest
    livenessProbe:
      httpGet:
        path: /api/health/simple
        port: 3001
      initialDelaySeconds: 30
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /api/health
        port: 3001
      initialDelaySeconds: 5
      periodSeconds: 5
``` 
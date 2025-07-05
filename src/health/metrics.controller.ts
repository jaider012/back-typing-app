import { Controller, Get } from '@nestjs/common';

@Controller('metrics')
export class MetricsController {
  private startTime = Date.now();
  private requestCount = 0;
  private errorCount = 0;

  @Get()
  getMetrics() {
    const uptime = Date.now() - this.startTime;
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      uptime: {
        seconds: Math.floor(uptime / 1000),
        human: this.formatUptime(uptime),
      },
      requests: {
        total: this.requestCount,
        errors: this.errorCount,
        successRate: this.requestCount > 0 ? 
          ((this.requestCount - this.errorCount) / this.requestCount * 100).toFixed(2) + '%' : 
          '100%',
      },
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
        heapUsedPercentage: `${Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)}%`,
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
      process: {
        pid: process.pid,
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3001,
      },
    };
  }

  @Get('prometheus')
  getPrometheusMetrics() {
    const memoryUsage = process.memoryUsage();
    const uptime = Date.now() - this.startTime;

    return `# HELP nodejs_memory_usage_bytes Memory usage in bytes
# TYPE nodejs_memory_usage_bytes gauge
nodejs_memory_usage_bytes{type="rss"} ${memoryUsage.rss}
nodejs_memory_usage_bytes{type="heapTotal"} ${memoryUsage.heapTotal}
nodejs_memory_usage_bytes{type="heapUsed"} ${memoryUsage.heapUsed}
nodejs_memory_usage_bytes{type="external"} ${memoryUsage.external}

# HELP nodejs_process_uptime_seconds Process uptime in seconds
# TYPE nodejs_process_uptime_seconds counter
nodejs_process_uptime_seconds ${Math.floor(uptime / 1000)}

# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total ${this.requestCount}

# HELP http_errors_total Total number of HTTP errors
# TYPE http_errors_total counter
http_errors_total ${this.errorCount}
`;
  }

  incrementRequestCount() {
    this.requestCount++;
  }

  incrementErrorCount() {
    this.errorCount++;
  }

  private formatUptime(uptime: number): string {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }
} 
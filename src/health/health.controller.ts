import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { FirebaseHealthIndicator } from './firebase-health.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private firebaseHealth: FirebaseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Check if Firebase is connected
      () => this.firebaseHealth.isHealthy('firebase'),
      
      // Check memory usage (max 150MB heap)
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      
      // Check memory usage (max 150MB RSS)
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      
      // Check disk usage (max 90% full)
      () => this.disk.checkStorage('storage', {
        thresholdPercent: 0.9,
        path: '/',
      }),
    ]);
  }

  @Get('simple')
  simpleCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      },
    };
  }

  @Get('detailed')
  detailedCheck() {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        pid: process.pid,
      },
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100,
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100,
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100,
        external: Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100,
        arrayBuffers: Math.round(memoryUsage.arrayBuffers / 1024 / 1024 * 100) / 100,
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
    };
  }
} 
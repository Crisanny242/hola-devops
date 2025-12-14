const http = require('http');
const os = require('os');

// Configuración desde variables de entorno (mejor práctica DevOps)
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_NAME = process.env.APP_NAME || 'DevOps-App';

// Headers estándar para APIs modernas
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'X-Powered-By': 'DevOps-CI/CD-Pipeline',
  'X-Environment': NODE_ENV,
  'X-App-Name': APP_NAME,
  'Cache-Control': 'no-cache'
};

// Datos del sistema para endpoint de salud
const systemInfo = {
  app: APP_NAME,
  environment: NODE_ENV,
  timestamp: new Date().toISOString(),
  hostname: os.hostname(),
  platform: os.platform(),
  uptime: process.uptime(),
  memory: process.memoryUsage(),
  nodeVersion: process.version
};

// Colores para logs (solo en desarrollo)
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

const server = http.createServer((req, res) => {
  const requestId = Date.now() + Math.random().toString(36).substr(2, 9);
  const startTime = Date.now();
  
  // Log estructurado de la petición
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
  }));
  
  // Enrutamiento básico
  if (req.url === '/health' && req.method === 'GET') {
    // Endpoint de salud (para monitoreo DevOps)
    res.writeHead(200, DEFAULT_HEADERS);
    res.end(JSON.stringify({
      status: 'healthy',
      ...systemInfo,
      uptime: `${Math.floor(process.uptime())}s`
    }, null, 2));
    return;
  }
  
  if (req.url === '/metrics' && req.method === 'GET') {
    // Endpoint de métricas (para Prometheus)
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`# HELP node_app_info Application information
# TYPE node_app_info gauge
node_app_info{app="${APP_NAME}",env="${NODE_ENV}"} 1

# HELP node_uptime_seconds Uptime in seconds
# TYPE node_uptime_seconds gauge
node_uptime_seconds ${process.uptime()}

# HELP node_memory_usage_bytes Memory usage in bytes
# TYPE node_memory_usage_bytes gauge
node_memory_usage_bytes ${process.memoryUsage().heapUsed}`);
    return;
  }
  
  if (req.url === '/' && req.method === 'GET') {
    // Endpoint principal con diseño mejorado
    res.writeHead(200, {
      ...DEFAULT_HEADERS,
      'Content-Type': 'text/html; charset=utf-8'
    });
    
    const htmlResponse = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 DevOps CI/CD Demo</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 3rem;
            max-width: 800px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            border: 1px solid rgba(255,255,255,0.2);
        }
        h1 { 
            font-size: 3.5rem; 
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: gradient 3s ease infinite;
            background-size: 400% 400%;
        }
        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .emoji { font-size: 4rem; margin-bottom: 1rem; }
        .subtitle {
            font-size: 1.5rem;
            opacity: 0.9;
            margin-bottom: 2rem;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        .info-card {
            background: rgba(255,255,255,0.15);
            padding: 1.5rem;
            border-radius: 12px;
            text-align: left;
        }
        .info-card h3 {
            color: #ffdd59;
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
        }
        .endpoints {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 2rem;
        }
        .endpoint-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 0.8rem 1.5rem;
            border-radius: 50px;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
            cursor: pointer;
            font-weight: bold;
        }
        .endpoint-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
        .badge {
            display: inline-block;
            padding: 0.3rem 0.8rem;
            background: ${NODE_ENV === 'production' ? '#ff6b6b' : '#1dd1a1'};
            border-radius: 20px;
            font-size: 0.8rem;
            margin-left: 0.5rem;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="emoji">🚀</div>
        <h1>DevOps CI/CD Pipeline</h1>
        <div class="subtitle">
            Aplicación Node.js para demostración de mejores prácticas DevOps
            <span class="badge">${NODE_ENV}</span>
        </div>
        
        <div class="info-grid">
            <div class="info-card">
                <h3>📊 Información del Sistema</h3>
                <p><strong>App:</strong> ${APP_NAME}</p>
                <p><strong>Entorno:</strong> ${NODE_ENV}</p>
                <p><strong>Hostname:</strong> ${os.hostname()}</p>
                <p><strong>Node.js:</strong> ${process.version}</p>
            </div>
            <div class="info-card">
                <h3>📈 Métricas en Tiempo Real</h3>
                <p><strong>Uptime:</strong> ${Math.floor(process.uptime())} segundos</p>
                <p><strong>Memoria:</strong> ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB</p>
                <p><strong>PID:</strong> ${process.pid}</p>
                <p><strong>Plataforma:</strong> ${os.platform()}</p>
            </div>
        </div>
        
        <p style="margin-top: 2rem; opacity: 0.8;">
            Esta aplicación está diseñada para demostrar la implementación de CI/CD, 
            contenedores Docker, y monitoreo en tiempo real.
        </p>
        
        <div class="endpoints">
            <a href="/health" class="endpoint-btn">🔍 Health Check</a>
            <a href="/metrics" class="endpoint-btn">📈 Métricas Prometheus</a>
            <button onclick="location.reload()" class="endpoint-btn">🔄 Recargar</button>
        </div>
    </div>
    
    <script>
        // Tiempo real - actualizar uptime cada segundo
        setInterval(() => {
            const uptimeElement = document.querySelector('.info-card:nth-child(2) p:nth-child(1)');
            if(uptimeElement) {
                const currentUptime = parseInt(uptimeElement.textContent.split(': ')[1]) + 1;
                uptimeElement.innerHTML = '<strong>Uptime:</strong> ' + currentUptime + ' segundos';
            }
        }, 1000);
    </script>
</body>
</html>`;
    
    res.end(htmlResponse);
    return;
  }
  
  // 404 para rutas no encontradas
  res.writeHead(404, DEFAULT_HEADERS);
  res.end(JSON.stringify({
    error: 'Not Found',
    message: 'Ruta no encontrada',
    requestId,
    timestamp: new Date().toISOString(),
    suggestedEndpoints: ['/', '/health', '/metrics']
  }));
  
  // Log de respuesta
  const duration = Date.now() - startTime;
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    requestId,
    statusCode: res.statusCode,
    durationMs: duration,
    message: 'Request completed'
  }));
});

// Manejo elegante de cierre
const shutdown = (signal) => {
  console.log(`${colors.yellow}⚠️  Recibido ${signal}. Cerrando servidor...${colors.reset}`);
  
  server.close(() => {
    console.log(`${colors.green}✅ Servidor cerrado correctamente${colors.reset}`);
    process.exit(0);
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error(`${colors.red}❌ Forzando cierre después de 10 segundos${colors.reset}`);
    process.exit(1);
  }, 10000);
};

// Capturar señales de terminación
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Iniciar servidor
server.listen(PORT, () => {
  const address = server.address();
  const url = `http://localhost:${PORT}`;
  
  console.log(`
${colors.cyan}╔══════════════════════════════════════════════════════════════╗
║                    🚀 DevOps CI/CD Application                    ║
╠══════════════════════════════════════════════════════════════╣
║  Status:   ${colors.green}● Running${colors.cyan}                              ║
║  Port:     ${PORT}                                            ║
║  Env:      ${NODE_ENV}                                      ║
║  App:      ${APP_NAME}                                    ║
║  PID:      ${process.pid}                                         ║
║  Node:     ${process.version}                             ║
║  URL:      ${url}                         ║
╠══════════════════════════════════════════════════════════════╣
║  Endpoints:                                                  ║
║  • ${url}/          - Dashboard principal                   ║
║  • ${url}/health    - Health check (JSON)                   ║
║  • ${url}/metrics   - Métricas Prometheus                   ║
╚══════════════════════════════════════════════════════════════╝${colors.reset}
  `);
});

module.exports = server;
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'QIZ Platform API is healthy',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
}

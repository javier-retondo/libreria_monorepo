import { Server } from './app';

async function main() {
  const server = new Server();
  console.log('Starting the server...');
  await server.handleConn();
  server.app.listen(server.port, () => {
    console.log(`Server is running on port ${server.port}`);
  });
}
main().catch((error) => {
  console.error('Error starting the server:', error);
  process.exit(1);
});

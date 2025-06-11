import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'tienda_libros',
  process.env.DB_USER || 'user',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3307', 10), // Si la aplicación se ejecuta en el contenedor y se usa mysql del contenedor. El puerto debe ser el mismo que se usa en el contenedor de MySQL en el docker-compose.yml para poder correr los seeders y migraciones.
    dialect: 'mysql',
    logging: true,
  },
);

export default sequelize;

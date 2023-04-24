import { SequelizeModule } from '@nestjs/sequelize';

export const database = SequelizeModule.forRoot({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: 'mysql',
  autoLoadModels: true,
  synchronize: false,
  define: {
    underscored: true,
  },
  dialectOptions:
    process.env.SSL_REQUIRED === 'true'
      ? {
          ssl: {
            required: true,
          },
        }
      : {},
});

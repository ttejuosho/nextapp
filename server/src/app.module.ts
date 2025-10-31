import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ObjectsModule } from './objects/objects.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'root',
      database: process.env.DB_NAME || 'autotrackerdb',
      autoLoadModels: true,
      synchronize: true,
      logging: false,

      // ✅ Move these INSIDE forRoot
      pool: {
        max: 15, // allow concurrency
        min: 2,
        idle: 10000,
        acquire: 60000,
      },
      dialectOptions: {
        statement_timeout: 60000, // 60s
        idle_in_transaction_session_timeout: 60000,
      },
    }),

    // ✅ Load your feature modules
    UsersModule,
    ObjectsModule,
  ],
})
export class AppModule {}

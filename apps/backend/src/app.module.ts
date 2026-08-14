import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';

import { Usuario, Rol } from './entities/usuario.entity';
import { Mascota } from './entities/mascota.entity';
import { Reporte, Imagen } from './entities/reporte.entity';

import { AuthModule } from './auth/auth.module';
import { ReportesModule } from './reportes/reportes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [Usuario, Rol, Mascota, Reporte, Imagen],
        synchronize: false,
        ssl: { rejectUnauthorized: false },
      }),
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('SMTP_HOST'),
          port: config.get<number>('SMTP_PORT'),
          secure: true,
          auth: {
            user: config.get<string>('SMTP_USER'),
            pass: config.get<string>('SMTP_PASS'),
          },
        },
        defaults: {
          from: `"VeciPets Notificaciones" <${config.get<string>('SMTP_USER')}>`,
        },
      }),
    }),

    AuthModule,
    ReportesModule,
  ],
})
export class AppModule {}
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { ScheduleModule } from '@nestjs/schedule';
import { FetchController } from './fetch/fetch.controller';
import { FetchService } from './fetch/fetch.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env.development', '.env.production'],
        }),

        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get('MONGODB_URI'),
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }),
        }),

        HttpModule,
        ScheduleModule.forRoot(),
    ],
    controllers: [AppController, FetchController],
    providers: [AppService, FetchService, ethers.providers.JsonRpcProvider],
})
export class AppModule {}

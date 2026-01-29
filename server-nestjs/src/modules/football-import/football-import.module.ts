import { Module } from '@nestjs/common';
import { FootballImportService } from './football-import.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [ScheduleModule.forRoot()],
    providers: [FootballImportService],
    exports: [FootballImportService],
})
export class FootballImportModule { }

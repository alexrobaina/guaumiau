import { Module } from '@nestjs/common'
import { WalkersController } from './walkers.controller'
import { WalkersService } from './walkers.service'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [WalkersController],
  providers: [WalkersService],
  exports: [WalkersService],
})
export class WalkersModule {}

import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { WalkersService } from './walkers.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { SearchWalkersDto } from './dto/search-walkers.dto'

@Controller('walkers')
@UseGuards(JwtAuthGuard)
export class WalkersController {
  constructor(private readonly walkersService: WalkersService) {}

  @Get()
  async getWalkers(@Query() searchDto: SearchWalkersDto) {
    return this.walkersService.searchWalkers(searchDto)
  }

  @Get(':id')
  async getWalker(@Param('id') id: string) {
    return this.walkersService.getWalkerById(id)
  }
}

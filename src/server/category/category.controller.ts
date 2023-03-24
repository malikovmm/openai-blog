import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import ParseIntSafePipe from '../pipes/ParseIntSafePipe';
import { SessionAuthGuard } from '../guards/session-auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(SessionAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  public async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  public async findAll(
    @Query('take', new ParseIntSafePipe(10)) take,
    @Query('page', new ParseIntSafePipe(1)) page,
    @Query('sortBy') sortBy = 'id',
    @Query('order') order = 'ASC',
    @Query('nameFilter') nameFilter?: string,
  ) {
    return await this.categoryService.findAll(
      take,
      page,
      sortBy,
      order,
      nameFilter,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}

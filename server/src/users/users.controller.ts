import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 200,
    @Query("sortField") sortField = "userId",
    @Query("sortOrder") sortOrder: "ASC" | "DESC" = "ASC",
    @Query("filterField") filterField?: string,
    @Query("filterValue") filterValue?: string,
    @Query("search") search?: string // <-- new search param
  ) {
    return this.usersService.findAll({
      page: Number(page),
      limit: Number(limit),
      sortField,
      sortOrder,
      filterField,
      filterValue,
      search,
    });
  }

  @Get("all")
  async getUsersWithObjects(
    @Query("page") page = 1,
    @Query("limit") limit = 100,
    @Query("sortField") sortField = "userId",
    @Query("sortOrder") sortOrder: "ASC" | "DESC" = "ASC",
    @Query("filterField") filterField?: string,
    @Query("filterValue") filterValue?: string,
    @Query("search") search?: string // <-- new search param
  ) {
    return this.usersService.getUsersWithObjects({
      page: Number(page),
      limit: Number(limit),
      sortField,
      sortOrder,
      filterField,
      filterValue,
      search, // pass search to service
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  @Post("import")
  async importUsers() {
    const filePath = "data/data2.json"; // <-- Change if needed
    return this.usersService.importFromFile(filePath);
  }
}

import { Global, Module } from "@nestjs/common";
import PrismaRepositorie from './Prisma';


@Global()
@Module({
  exports: [PrismaRepositorie],
  providers:[PrismaRepositorie]
  })
export default class DatabaseModule{

}
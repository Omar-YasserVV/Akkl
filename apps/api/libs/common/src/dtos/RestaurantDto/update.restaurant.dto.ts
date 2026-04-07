import { PartialType } from '@nestjs/swagger'; // ⚡ Use swagger version for proper docs
import { CreateRestaurantDto } from './create.restaurant.dto';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {}

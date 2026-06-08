import { PartialType } from '@nestjs/mapped-types';
import { CreateCamioneDto } from './create-camione.dto';

export class UpdateCamioneDto extends PartialType(CreateCamioneDto) {}

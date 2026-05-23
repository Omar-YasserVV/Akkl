import { PartialType } from '@nestjs/swagger';
import { UpdateOnboardingDto } from './create.branch.dto'; // Ensure path is correct

export class UpdateBranchDto extends PartialType(UpdateOnboardingDto) {}
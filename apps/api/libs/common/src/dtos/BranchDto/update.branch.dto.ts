import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateBranchDto } from './create.branch.dto';

export class UpdateBranchDto extends OmitType(PartialType(CreateBranchDto), [
  'branchNumber',
] as const) {}

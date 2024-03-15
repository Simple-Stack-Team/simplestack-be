import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  Put,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { OrganizationsService } from 'src/organizations/organizations.service';
import { TeamRoleDto } from 'src/organizations/dto/teamrole.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/types/role.types';

@ApiBearerAuth()
@ApiTags('organizations')
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
@ApiNotFoundResponse({ description: 'Organization not found' })
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @ApiCreatedResponse({ description: 'Organization created' })
  @Roles(Role.ORGANIZATION_ADMIN)
  @Post(':orgId/teamroles')
  async createTeamRoles(
    @Param('orgId') orgId: string,
    @Body() teamRole: TeamRoleDto,
  ) {
    return await this.organizationsService.createOrganizationTeamRoles(
      teamRole.name,
      orgId,
    );
  }

  @ApiOkResponse({ description: 'Organization team roles list' })
  @Roles(Role.ORGANIZATION_ADMIN)
  @Get(':orgId/teamroles')
  async getTeamRoles(@Param('orgId') orgId: string) {
    return await this.organizationsService.getOrganizationTeamRoles(orgId);
  }

  @ApiCreatedResponse({ description: 'Organization teamroles updated' })
  @ApiNotFoundResponse({ description: 'Team role not found' })
  @Roles(Role.ORGANIZATION_ADMIN)
  @Put(':orgId/teamroles/:teamroleId')
  async updateTeamRole(
    @Param('orgId') orgId: string,
    @Param('teamroleId') teamRoleId: string,
    @Body() teamRole: TeamRoleDto,
  ) {
    return await this.organizationsService.updateTeamRole(
      orgId,
      teamRoleId,
      teamRole.name,
    );
  }

  @ApiOkResponse({ description: 'Organization team role deleted' })
  @Roles(Role.ORGANIZATION_ADMIN)
  @ApiNotFoundResponse({ description: 'Team role not found' })
  @Delete(':orgId/teamroles/:teamroleId')
  async deleteTeamRole(
    @Param('orgId') orgId: string,
    @Param('teamroleId') teamRoleId: string,
  ) {
    return await this.organizationsService.deleteTeamRole(orgId, teamRoleId);
  }
}

import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LeadsService } from "./leads.service";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { LeadResponseDto } from "./dto/lead-response.dto";

@ApiTags("Leads")
@Controller("api/leads")
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new lead" })
  @ApiResponse({ status: 201, description: "Lead created", type: LeadResponseDto })
  async create(@Body() dto: CreateLeadDto): Promise<LeadResponseDto> {
    const id = await this.leadsService.create(dto);
    return { id, status: "received" };
  }
}

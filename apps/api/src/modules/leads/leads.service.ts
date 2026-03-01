import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { ResendService } from "../email/resend.service";

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: ResendService,
  ) {}

  async create(dto: CreateLeadDto): Promise<string> {
    const score =
      (dto.company ? 10 : 0) +
      (dto.message && dto.message.length > 100 ? 10 : 0) +
      (dto.service && dto.service.toLowerCase() === "ai automation" ? 20 : 0);
    const lead = await this.prisma.lead.create({
      data: {
        name: dto.name,
        email: dto.email,
        company: dto.company ?? null,
        message: dto.message,
        service: dto.service ?? null,
        score,
      },
      select: { id: true },
    });
    this.email
      .sendLeadConfirmation(dto.email, dto.name)
      .catch((err) => console.error("Failed to send confirmation email", err));
    return lead.id;
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { ResendService } from "../email/resend.service";
import { LeadsAdminListQueryDto } from "./dto/leads-admin-list-query.dto";
import { UpdateLeadAdminDto } from "./dto/update-lead-admin.dto";

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

  async adminList(query: LeadsAdminListQueryDto): Promise<{ items: Array<unknown>; nextCursor?: string }> {
    const take = query.take ?? 20;
    const where = query.status ? { status: query.status } : undefined;
    const items = await this.prisma.lead.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      take: take + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        message: true,
        service: true,
        score: true,
        status: true,
        createdAt: true,
      },
    });
    let nextCursor: string | undefined;
    if (items.length > take) {
      const next = items.pop();
      nextCursor = next?.id;
    }
    return { items, nextCursor };
  }

  async adminGetById(id: string): Promise<unknown> {
    const item = await this.prisma.lead.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        message: true,
        service: true,
        score: true,
        status: true,
        createdAt: true,
      },
    });
    if (!item) throw new NotFoundException("Lead not found");
    return item;
  }

  async adminUpdate(id: string, dto: UpdateLeadAdminDto): Promise<{ id: string }> {
    const updated = await this.prisma.lead.update({
      where: { id },
      data: {
        status: dto.status ?? undefined,
      },
      select: { id: true },
    }).catch(() => null);
    if (!updated) throw new NotFoundException("Lead not found");
    return { id: id };
  }
}

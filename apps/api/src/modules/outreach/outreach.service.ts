import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateOutreachDto } from "./dto/create-outreach.dto";
import { UpdateOutreachDto } from "./dto/update-outreach.dto";

type PrismaLike = {
  outreachLog: {
    create(args: unknown): Promise<{ id: string }>;
    findMany(args: unknown): Promise<Array<Record<string, unknown>>>;
    update(args: unknown): Promise<unknown>;
  };
};

@Injectable()
export class OutreachService {
  private readonly prismaLike: PrismaLike;
  constructor(private readonly prisma: PrismaService) {
    this.prismaLike = this.prisma as unknown as PrismaLike;
  }

  async create(dto: CreateOutreachDto) {
    const created = await this.prismaLike.outreachLog.create({
      data: {
        jobLeadId: dto.jobLeadId,
        channel: dto.channel,
        sentAt: new Date(dto.sentAt),
        subject: dto.subject ?? null,
        body: dto.body ?? null,
      },
      select: { id: true },
    });
    return { id: created.id };
  }

  async list(jobLeadId?: string) {
    const where = jobLeadId ? { jobLeadId } : undefined;
    return this.prismaLike.outreachLog.findMany({
      where,
      orderBy: [{ sentAt: "desc" }],
      select: {
        id: true,
        jobLeadId: true,
        channel: true,
        sentAt: true,
        subject: true,
        body: true,
        response: true,
        responseAt: true,
        outcome: true,
      },
    } as unknown);
  }

  async update(id: string, dto: UpdateOutreachDto) {
    const updated = await this.prismaLike.outreachLog
      .update({
        where: { id },
        data: {
          response: dto.response ?? undefined,
          responseAt: dto.responseAt ? new Date(dto.responseAt) : undefined,
          outcome: dto.outcome ?? undefined,
        },
        select: { id: true },
      } as unknown)
      .catch(() => null);
    if (!updated) throw new NotFoundException("Outreach not found");
    return { id };
  }
}

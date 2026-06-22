import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { ResendService } from "../email/resend.service";
import { LeadsAdminListQueryDto } from "./dto/leads-admin-list-query.dto";
import { UpdateLeadAdminDto } from "./dto/update-lead-admin.dto";
import { applyCursorPage } from "../../common/utils/pagination";

/**
 * Lead-scoring weights. A lead's score is the sum of the signals it matches,
 * giving the admin a quick triage hint (higher = warmer). Tweak the weights
 * here rather than editing the arithmetic in `create`.
 */
const LEAD_SCORE_WEIGHTS = {
  /** Provided a company name (indicates a business inquiry). */
  hasCompany: 10,
  /** Wrote a substantial message (> this many chars). */
  longMessage: 10,
  /** Requested the high-intent "AI automation" service. */
  aiAutomationService: 20,
} as const;

/** Minimum message length (chars) that counts as a "long" message. */
const LONG_MESSAGE_MIN_LENGTH = 100;

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: ResendService,
  ) {}

  async create(dto: CreateLeadDto): Promise<string> {
    const score =
      (dto.company ? LEAD_SCORE_WEIGHTS.hasCompany : 0) +
      (dto.message && dto.message.length > LONG_MESSAGE_MIN_LENGTH
        ? LEAD_SCORE_WEIGHTS.longMessage
        : 0) +
      (dto.service && dto.service.toLowerCase() === "ai automation"
        ? LEAD_SCORE_WEIGHTS.aiAutomationService
        : 0);
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
      .catch((err: unknown) =>
        this.logger.error(
          "Failed to send confirmation email",
          err instanceof Error ? err.stack : String(err),
        ),
      );
    return lead.id;
  }

  async adminList(query: LeadsAdminListQueryDto): Promise<{ items: Array<unknown>; nextCursor?: string }> {
    const take = query.take ?? 20;
    const where = query.status ? { status: query.status } : undefined;
    const rows = await this.prisma.lead.findMany({
      where,
      // `id` is the unique tiebreaker that makes the createdAt ordering total.
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
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
    return applyCursorPage(rows, take);
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

  async adminDelete(id: string): Promise<void> {
    await this.prisma.lead.delete({ where: { id } }).catch(() => {
      throw new NotFoundException("Lead not found");
    });
  }

}

import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  CreateJobLeadDto,
  JobPlatformDto,
  JobSourceDto,
} from "./dto/create-job-lead.dto";
import { ListJobLeadsQuery, JobStatusDto } from "./dto/list-job-leads.query";
import { UpdateJobLeadDto } from "./dto/update-job-lead.dto";
import { CsvImportDto } from "./dto/csv-import.dto";
import { AIService } from "../../services/ai.service";

@Injectable()
export class JobLeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AIService,
  ) {}

  // NOTE: custom implementation — guard against missing Prisma types before generate by typing narrowly with unknown
  private get prismaJobLead() {
    const client = this.prisma as unknown as {
      jobLead: {
        create(args: unknown): Promise<{ id: string }>;
        findMany(args: unknown): Promise<Array<Record<string, unknown>>>;
        findUnique(args: unknown): Promise<Record<string, unknown> | null>;
        update(args: unknown): Promise<unknown>;
        delete(args: unknown): Promise<unknown>;
      };
      $transaction<T = unknown>(args: Array<Promise<T>>): Promise<T[]>;
    };
    return client.jobLead;
  }

  async create(dto: CreateJobLeadDto) {
    const lead = await this.prismaJobLead.create({
      data: {
        title: dto.title,
        company: dto.company,
        platform: dto.platform,
        description: dto.description,
        techStack: dto.techStack ?? [],
        budgetMin: dto.budgetMin ?? null,
        budgetMax: dto.budgetMax ?? null,
        currency: dto.currency ?? null,
        url: dto.url ?? null,
        contactEmail: dto.contactEmail ?? null,
        contactName: dto.contactName ?? null,
        source: dto.source ?? JobSourceDto.MANUAL,
        notes: dto.notes ?? null,
      },
      select: { id: true },
    });
    return lead.id;
  }

  async importCsv(input: CsvImportDto) {
    const rows = this.parseCsv(input.csv);
    const toCreate = rows.map((r) => ({
      title: r.title,
      company: r.company,
      platform: (r.platform as JobPlatformDto) ?? JobPlatformDto.OTHER,
      description: r.description ?? "",
      techStack: r.techStack ? r.techStack.split("|").map((s) => s.trim()) : [],
      budgetMin: r.budgetMin ? Number(r.budgetMin) : null,
      budgetMax: r.budgetMax ? Number(r.budgetMax) : null,
      currency: r.currency ?? null,
      url: r.url ?? null,
      contactEmail: r.contactEmail ?? null,
      contactName: r.contactName ?? null,
      source: JobSourceDto.CSV,
      notes: r.notes ?? null,
    }));
    const client = this.prisma as unknown as {
      $transaction<T>(args: Array<Promise<T>>): Promise<T[]>;
    };
    await client.$transaction(
      toCreate.map((data) => this.prismaJobLead.create({ data })),
    );
    return { created: toCreate.length };
  }

  async list(query: ListJobLeadsQuery) {
    const where: Record<string, unknown> = {};
    if (query.platform) where.platform = query.platform;
    if (query.status) where.status = query.status;
    const score: { gte?: number; lte?: number } = {};
    if (query.minScore !== undefined) score.gte = query.minScore;
    if (query.maxScore !== undefined) score.lte = query.maxScore;
    if (Object.keys(score).length > 0)
      (where as unknown as { score: typeof score }).score = score;
    const take = query.take ?? 20;
    const leads = await this.prismaJobLead.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      take: take + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      select: {
        id: true,
        title: true,
        company: true,
        platform: true,
        status: true,
        score: true,
        createdAt: true,
      },
    });
    let nextCursor: string | undefined;
    if (leads.length > take) {
      const next = leads.pop();
      nextCursor = next?.id as string | undefined;
    }
    return { items: leads, nextCursor };
  }

  async getById(id: string) {
    const lead = await this.prismaJobLead.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        company: true,
        platform: true,
        description: true,
        techStack: true,
        budgetMin: true,
        budgetMax: true,
        currency: true,
        url: true,
        contactEmail: true,
        contactName: true,
        score: true,
        scoreReason: true,
        pitchAngle: true,
        status: true,
        source: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!lead) throw new NotFoundException("Job lead not found");
    return lead;
  }

  async update(id: string, dto: UpdateJobLeadDto) {
    const lead = await this.prismaJobLead
      .update({
        where: { id },
        data: {
          status: dto.status ?? undefined,
          notes: dto.notes ?? undefined,
        },
        select: { id: true },
      })
      .catch(() => null);
    if (!lead) throw new NotFoundException("Job lead not found");
    return { id };
  }

  async remove(id: string) {
    const lead = await this.prismaJobLead
      .delete({ where: { id }, select: { id: true } })
      .catch(() => null);
    if (!lead) throw new NotFoundException("Job lead not found");
    return { id };
  }

  async score(id: string) {
    const lead = await this.prismaJobLead.findUnique({
      where: { id },
      select: { id: true, description: true, techStack: true },
    });
    if (!lead) throw new NotFoundException("Job lead not found");
    const skills = ["NestJS", "Next.js", "React Native", "AI automation"];
    const result = await this.ai.scoreLead(
      lead.description as string,
      (lead.techStack as string[]) ?? [],
      skills,
    );
    await this.prismaJobLead.update({
      where: { id },
      data: {
        score: result.score,
        scoreReason: result.reason,
        pitchAngle: result.pitchAngle,
      },
      select: { id: true },
    });
    return result;
  }

  private parseCsv(csv: string): Array<Record<string, string>> {
    const lines = csv.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim());
    return lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim());
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => (obj[h] = cols[i] ?? ""));
      return obj;
    });
  }
}

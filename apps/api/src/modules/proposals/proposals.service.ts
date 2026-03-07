import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { GenerateProposalDto } from "./dto/generate-proposal.dto";
import { UpdateProposalDto } from "./dto/update-proposal.dto";
import { AiService } from "../ai/ai.service";

type PrismaLike = {
  proposal: {
    create(args: unknown): Promise<{ id: string }>;
    findMany(args: unknown): Promise<Array<Record<string, unknown>>>;
    update(args: unknown): Promise<unknown>;
    delete(args: unknown): Promise<unknown>;
  };
  jobLead: {
    findUnique(args: unknown): Promise<Record<string, unknown> | null>;
  };
  project: {
    findMany(args: unknown): Promise<Array<{ title: string; description: string; techStack: string[] }>>;
  };
};

@Injectable()
export class ProposalsService {
  private readonly prismaLike: PrismaLike;

  constructor(private readonly prisma: PrismaService, private readonly ai: AiService) {
    this.prismaLike = this.prisma as unknown as PrismaLike;
  }

  async generate(dto: GenerateProposalDto) {
    const lead = await this.prismaLike.jobLead.findUnique({
      where: { id: dto.jobLeadId },
      select: { id: true, description: true },
    });
    if (!lead) throw new NotFoundException("Job lead not found");
    const projects = await this.prismaLike.project.findMany({
      select: { title: true, description: true, techStack: true },
      orderBy: { order: "asc" },
      take: 5,
    } as unknown);
    const content = await this.ai.generateProposal(lead.description as string, dto.variant, projects);
    const created = await this.prismaLike.proposal.create({
      data: {
        jobLeadId: dto.jobLeadId,
        variant: dto.variant,
        content,
        approved: false,
      },
      select: { id: true },
    });
    return { id: created.id, content };
  }

  async list(jobLeadId?: string) {
    const where = jobLeadId ? { jobLeadId } : undefined;
    const items = await this.prismaLike.proposal.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        jobLeadId: true,
        variant: true,
        content: true,
        approved: true,
        sentAt: true,
        createdAt: true,
      },
    } as unknown);
    return items;
  }

  async update(id: string, dto: UpdateProposalDto) {
    const updated = await this.prismaLike.proposal
      .update({
        where: { id },
        data: {
          content: dto.content ?? undefined,
          approved: dto.approved ?? undefined,
        },
        select: { id: true },
      } as unknown)
      .catch(() => null);
    if (!updated) throw new NotFoundException("Proposal not found");
    return { id };
  }

  async remove(id: string) {
    const deleted = await this.prismaLike.proposal
      .delete({ where: { id }, select: { id: true } } as unknown)
      .catch(() => null);
    if (!deleted) throw new NotFoundException("Proposal not found");
    return { id };
  }
}

import { Test } from "@nestjs/testing";
import { ProjectsAdminController } from "./projects-admin.controller";
import { ProjectsService } from "./projects.service";

describe("ProjectsAdminController", () => {
  let controller: ProjectsAdminController;
  let service: { create: jest.Mock; update: jest.Mock; remove: jest.Mock };

  beforeEach(async () => {
    service = {
      create: jest.fn().mockResolvedValue("new-id"),
      update: jest.fn().mockResolvedValue({ id: "u" }),
      remove: jest.fn().mockResolvedValue({ id: "r" }),
    };
    const moduleRef = await Test.createTestingModule({
      controllers: [ProjectsAdminController],
      providers: [{ provide: ProjectsService, useValue: service }],
    }).compile();
    controller = moduleRef.get(ProjectsAdminController);
  });

  it("create delegates and wraps the id", async () => {
    const dto = {
      slug: "s",
      title: "t",
      description: "d",
      category: "Web",
      year: 2025,
      techStack: [],
      featured: false,
      order: 0,
    };
    await expect(controller.create(dto)).resolves.toEqual({ id: "new-id" });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it("update delegates with id and dto", async () => {
    await controller.update("id1", { title: "new" });
    expect(service.update).toHaveBeenCalledWith("id1", { title: "new" });
  });

  it("remove delegates with the id", async () => {
    await controller.remove("id1");
    expect(service.remove).toHaveBeenCalledWith("id1");
  });
});

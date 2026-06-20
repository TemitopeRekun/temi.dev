import { Test } from "@nestjs/testing";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";

describe("ProjectsController", () => {
  let controller: ProjectsController;
  let service: { list: jest.Mock; getBySlug: jest.Mock; getById: jest.Mock };

  beforeEach(async () => {
    service = {
      list: jest.fn().mockResolvedValue({ items: [], nextCursor: undefined }),
      getBySlug: jest.fn().mockResolvedValue({ id: "1" }),
      getById: jest.fn().mockResolvedValue({ id: "1" }),
    };
    const moduleRef = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [{ provide: ProjectsService, useValue: service }],
    }).compile();
    controller = moduleRef.get(ProjectsController);
  });

  it("list delegates to the service", async () => {
    await controller.list({ take: 20 });
    expect(service.list).toHaveBeenCalledWith({ take: 20 });
  });

  it("getBySlug delegates to the service", async () => {
    await controller.getBySlug("slug-1");
    expect(service.getBySlug).toHaveBeenCalledWith("slug-1");
  });

  it("getById delegates to the service", async () => {
    await controller.getById("id-1");
    expect(service.getById).toHaveBeenCalledWith("id-1");
  });
});

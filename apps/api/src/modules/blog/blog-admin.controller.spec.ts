import { Test } from "@nestjs/testing";
import { BlogAdminController } from "./blog-admin.controller";
import { BlogService } from "./blog.service";

describe("BlogAdminController", () => {
  let controller: BlogAdminController;
  let service: {
    adminListAll: jest.Mock;
    adminCreate: jest.Mock;
    adminUpdate: jest.Mock;
    adminRemove: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      adminListAll: jest
        .fn()
        .mockResolvedValue({ items: [], nextCursor: undefined }),
      adminCreate: jest.fn().mockResolvedValue({ id: "c" }),
      adminUpdate: jest.fn().mockResolvedValue({ id: "u" }),
      adminRemove: jest.fn().mockResolvedValue({ id: "r" }),
    };
    const moduleRef = await Test.createTestingModule({
      controllers: [BlogAdminController],
      providers: [{ provide: BlogService, useValue: service }],
    }).compile();
    controller = moduleRef.get(BlogAdminController);
  });

  it("list delegates with the query", async () => {
    await controller.list({ take: 5 });
    expect(service.adminListAll).toHaveBeenCalledWith({ take: 5 });
  });

  it("create delegates with the dto", async () => {
    const dto = {
      slug: "s",
      title: "t",
      content: "c",
      tags: [],
      published: false,
    };
    await expect(controller.create(dto)).resolves.toEqual({ id: "c" });
    expect(service.adminCreate).toHaveBeenCalledWith(dto);
  });

  it("update delegates with id and dto", async () => {
    await controller.update("id1", { title: "new" });
    expect(service.adminUpdate).toHaveBeenCalledWith("id1", { title: "new" });
  });

  it("remove delegates with the id", async () => {
    await controller.remove("id1");
    expect(service.adminRemove).toHaveBeenCalledWith("id1");
  });
});

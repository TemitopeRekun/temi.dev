import { Test } from "@nestjs/testing";
import { BlogController } from "./blog.controller";
import { BlogService } from "./blog.service";

describe("BlogController", () => {
  let controller: BlogController;
  let service: { list: jest.Mock; getBySlug: jest.Mock };

  beforeEach(async () => {
    service = {
      list: jest.fn().mockResolvedValue({ items: [], nextCursor: undefined }),
      getBySlug: jest.fn().mockResolvedValue({ id: "1" }),
    };
    const moduleRef = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [{ provide: BlogService, useValue: service }],
    }).compile();
    controller = moduleRef.get(BlogController);
  });

  it("list delegates to the service", async () => {
    await controller.list({ take: 10 });
    expect(service.list).toHaveBeenCalledWith({ take: 10 });
  });

  it("getBySlug delegates to the service", async () => {
    await controller.getBySlug("my-slug");
    expect(service.getBySlug).toHaveBeenCalledWith("my-slug");
  });
});

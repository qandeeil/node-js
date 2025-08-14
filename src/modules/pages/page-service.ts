import PageModel, { IPage } from './page-model';

export class PageService {
  async create(title: string, content?: string) {
    return PageModel.create({ title, content });
  }

  async list(limit: number, cursor?: string) {
    const query: any = {};
    if (cursor) {
      query._id = { $gt: cursor };
    }
    const items = await PageModel.find(query).sort({ _id: 1 }).limit(limit + 1).lean();
    let nextCursor: string | null = null;
    if (items.length > limit) {
      const next = items.pop();
      nextCursor = next!._id.toString();
    }
    const data = items.map((d) => ({ id: d._id.toString(), title: d.title, content: d.content, createdAt: d.createdAt }));
    return { data, nextCursor };
  }

  async clearAll() {
    await PageModel.deleteMany({});
  }
}

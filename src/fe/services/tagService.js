import ApiService from "./baseService";

class TagService extends ApiService {
  constructor() {
    super();
  }
  async getTagById(id){
    const data = await this.get(`tag/${id}`);
    return data;
  }
}

const tagService = new TagService();
export default tagService;
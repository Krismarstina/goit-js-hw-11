import axios from './axios';
const API_KEY = '29947146-acb3d8de375d43c41f890757b';

export default class ApiService {
  constructor() {
    this.inputValue = '';
    this.page = 1;
  }

  getCurrentPage() {
    return this.page - 1;
  }

  async fetchImages() {
    try {
      const response = await axios.get(
        `?key=${API_KEY}&q=${this.inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
      );
      const data = await response.data;
      this.page += 1;
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  resetPage() {
    this.page = 1;
  }
}

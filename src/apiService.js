import axios from 'axios';
const API_KEY = '29947146-acb3d8de375d43c41f890757b';
const BASE_URL = 'https://pixabay.com/api/';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.hits = 0;
    this.totalHits = 0;
  }

  getCurrentPage() {
    return this.page - 1;
  }

  async fetchImages() {
    try {
      const response = await axios.get(
        `${BASE_URL}?key=${API_KEY}&q='${this.searchQuery}'&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
      );
      const data = await response.data;

      this.page += 1;
      this.totalHits = data.totalHits;

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

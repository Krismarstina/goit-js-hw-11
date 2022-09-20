import axios from './axios';
const API_KEY = '29947146-acb3d8de375d43c41f890757b';

export default class NewsApiService {
  constructor() {
    this.inputValue = '';
    this.page = 1;
  }

  getCurrentPage() {
    return this.page - 1;
  }

  fetchArticles() {
    return axios
      .get(
        `?key=${API_KEY}&q=${this.inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
      )
      .then(response => {
        this.page += 1;
        return response.data.hits;
      })
      .catch(error => console.log(error));
  }

  fetchTotalHits() {
    return axios
      .get(
        `?key=${API_KEY}&q=${this.inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
      )
      .then(response => {
        return response.data;
      })
      .catch(error => console.log(error));
  }

  resetPage() {
    this.page = 1;
  }
}

class ApiService {
  constructor() {
    this.BASE_URL = 'https://contact-karo.vercel.app/api/v0';
  }
  async get(path){
    const response = await fetch(`${this.BASE_URL}/${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  }
}

export default ApiService;
interface HttpClient {
  get<T>(url: string): Promise<T>;
}

const httpClient: HttpClient = {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },
};

export default httpClient;

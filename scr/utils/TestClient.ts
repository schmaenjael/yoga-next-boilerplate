import * as rp from 'request-promise';

export class TestClient {
  url: string;
  options: {
    jar: any;
    withCredentials: boolean;
    json: boolean;
  };
  constructor(url: string) {
    this.url = url;
    this.options = {
      withCredentials: true,
      jar: rp.jar(),
      json: true,
    };
  }
  async register(
    email: string,
    userName: string,
    password: string,
    confirmPassword: string
  ) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
          mutation {
            register(
              email: "${email}"
              userName: "${userName}"
              password: "${password}"
              confirmPassword: "${confirmPassword}"
            ) {
              severity
              titel
              path
              message
            }
          }
          `,
      },
    });
  }
}

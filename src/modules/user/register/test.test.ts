// Dependencies
//import { Connection } from 'typeorm';

console.log(process.env.TEST_HOST);
/*
// Setup
//import { TestClient } from '../../../utils/TestClient';
import { startTestTypeorm } from '../../../testUtils/startTestTypeorm';

let conn: Connection;
beforeAll(async () => {
  conn = await startTestTypeorm();
});
afterAll(async () => {
  conn.close();
});

console.log(process.env.TEST_HOST);

// Create client
//const client = new TestClient(process.env.TEST_HOST as string);
*/
describe('Test', () => {
  test('Test', async () => {
    let i: any = null;
    expect(i).toBeNull();
  });
});

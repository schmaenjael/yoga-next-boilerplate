import type { Config } from '@jest/types';

// Or async function
export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globalSetup: './scr/testUtils/setup.ts',
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    coverageDirectory: 'coverage',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };
};

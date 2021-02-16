module.exports = {
	verbose: false,
	preset: 'ts-jest',
	testEnvironment: 'node',
	setupFiles: ['./src/testUtils/setup.ts'],
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
	coverageDirectory: 'coverage',
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

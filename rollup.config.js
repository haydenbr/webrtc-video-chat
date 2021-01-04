import typescript from '@rollup/plugin-typescript';

export default {
  input: 'client/video-chat-main.ts',
  output: {
    dir: './client/dist',
		format: 'es',
		sourcemap: true
	},
	plugins: [typescript({
		tsconfig: './tsconfig.json',
	})]
};
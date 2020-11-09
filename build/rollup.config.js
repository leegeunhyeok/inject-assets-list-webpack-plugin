import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default [
  {
    input: 'index.ts',
    output: [
      {
        file: `dist/index.js`,
        format: 'cjs',
      },
    ],
    plugins: [
      resolve({
        extensions: ['js'],
      }),
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/env'],
      }),
      commonjs({ include: 'node_modules/**' }),
      typescript({ tsconfig: './tsconfig.json', clean: true }),
    ],
  },
];

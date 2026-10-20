import {defineConfig} from 'vitest/config';
export default defineConfig({test:{globals:true,environment:'jsdom',setupFiles:['./src/__tests__/setup.ts'],include:['website/tests/private-boundary.test.jsx'],fileParallelism:false}});

import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        exclude: ['tests/playwright/**'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            reportsDirectory: './coverage',
            include: [
                'src/app/constants/translations.ts',
                'src/app/hooks/useGitHubOperations.ts',
                'src/app/services/GitHubService.ts',
                'src/app/utils/statsContract.ts',
            ],
            thresholds: {
                perFile: true,
                lines: 100,
                functions: 100,
                branches: 100,
                statements: 100,
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})

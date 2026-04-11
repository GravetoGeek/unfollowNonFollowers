describe('/api/stats route contract', () => {
    beforeEach(() => {
        vi.resetModules()
        delete process.env.KV_REST_API_URL
    })

    it('retorna 400 quando body JSON é inválido', async () => {
        const { POST } = await import('@/app/api/stats/route')

        const request = new Request('http://localhost:3000/api/stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{ invalid json',
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.success).toBe(false)
        expect(data.error).toBe('Invalid request body')
        expect(typeof data.visitors).toBe('number')
        expect(Array.isArray(data.lastUsers)).toBe(true)
    })

    it('retorna 400 quando username não é informado', async () => {
        const { POST } = await import('@/app/api/stats/route')

        const request = new Request('http://localhost:3000/api/stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.success).toBe(false)
        expect(data.error).toBe('Username is required')
        expect(typeof data.visitors).toBe('number')
        expect(Array.isArray(data.lastUsers)).toBe(true)
    })

    it('GET incrementa visitors no fallback local', async () => {
        const writeFile = vi.fn().mockResolvedValue(undefined)

        vi.doMock('fs/promises', () => ({
            default: {
                readFile: vi.fn().mockResolvedValue(JSON.stringify({ visitors: 2, lastUsers: ['alice'] })),
                writeFile,
            },
        }))

        const { GET } = await import('@/app/api/stats/route')
        const response = await GET()
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.visitors).toBe(3)
        expect(data.lastUsers).toEqual(['alice'])

        expect(writeFile).toHaveBeenCalledOnce()
        const persisted = JSON.parse(writeFile.mock.calls[0][1]) as { visitors: number }
        expect(persisted.visitors).toBe(3)
    })

    it('POST move username para o topo sem duplicar (case-insensitive) no fallback local', async () => {
        const writeFile = vi.fn().mockResolvedValue(undefined)

        vi.doMock('fs/promises', () => ({
            default: {
                readFile: vi.fn().mockResolvedValue(
                    JSON.stringify({
                        visitors: 7,
                        lastUsers: ['alice', 'bob', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
                    }),
                ),
                writeFile,
            },
        }))

        const { POST } = await import('@/app/api/stats/route')

        const request = new Request('http://localhost:3000/api/stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'ALICE' }),
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.visitors).toBe(7)
        expect(data.lastUsers).toEqual(['ALICE', 'bob', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'])

        expect(writeFile).toHaveBeenCalledOnce()
        const persisted = JSON.parse(writeFile.mock.calls[0][1]) as { lastUsers: string[] }
        expect(persisted.lastUsers).toEqual(['ALICE', 'bob', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'])
    })
})

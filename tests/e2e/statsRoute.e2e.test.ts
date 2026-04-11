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
})

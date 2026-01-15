import fs from 'fs/promises'
import {NextResponse} from 'next/server'
import path from 'path'

// Using a file in the project root to mock a database
const DB_PATH=path.join(process.cwd(),'data.json')

interface StatsData {
    visitors: number
    lastUsers: string[]
}

const getStats=async (): Promise<StatsData> => {
    try {
        const fileContent=await fs.readFile(DB_PATH,'utf-8')
        return JSON.parse(fileContent)
    } catch {
        // If file doesn't exist or is invalid, return default
        return {visitors: 0,lastUsers: []}
    }
}

const saveStats=async (data: StatsData) => {
    try {
        await fs.writeFile(DB_PATH,JSON.stringify(data,null,2),'utf-8')
    } catch(error) {
        console.error("Failed to save stats",error)
    }
}

export async function GET() {
    const data=await getStats()

    // Increment visitors on every page load (GET request)
    data.visitors=(data.visitors||0)+1

    await saveStats(data)

    return NextResponse.json(data)
}

export async function POST(request: Request) {
    const body=await request.json()
    const {username}=body

    if(!username) {
        return NextResponse.json({error: 'Username is required'},{status: 400})
    }

    const data=await getStats()

    // Remove if exists to move to top
    const filteredUsers=(data.lastUsers||[]).filter(u => u.toLowerCase()!==username.toLowerCase())

    // Add to beginning
    filteredUsers.unshift(username)

    // Keep only last 10
    data.lastUsers=filteredUsers.slice(0,10)

    await saveStats(data)

    return NextResponse.json(data)
}

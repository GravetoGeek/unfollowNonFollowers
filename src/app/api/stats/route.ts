import {kv} from '@vercel/kv'
import fs from 'fs/promises'
import {NextResponse} from 'next/server'
import path from 'path'

// Using a file in the project root to mock a database (fallback for local dev)
const DB_PATH=path.join(process.cwd(),'data.json')
const USE_KV=!!process.env.KV_REST_API_URL

interface StatsData {
    visitors: number
    lastUsers: string[]
}

const getStatsFromFile=async (): Promise<StatsData> => {
    try {
        const fileContent=await fs.readFile(DB_PATH,'utf-8')
        return JSON.parse(fileContent)
    } catch {
        // If file doesn't exist or is invalid, return default
        return {visitors: 0,lastUsers: []}
    }
}

const saveStatsToFile=async (data: StatsData) => {
    try {
        await fs.writeFile(DB_PATH,JSON.stringify(data,null,2),'utf-8')
    } catch(error) {
        console.error("Failed to save stats to file",error)
    }
}

export async function GET() {
    if(USE_KV) {
        try {
            // Atomic increment for visitors
            const visitors=await kv.incr('visitors')
            const lastUsers=await kv.lrange('last_users',0,9)
            return NextResponse.json({visitors,lastUsers: lastUsers||[]})
        } catch(error) {
            console.error("KV Error:",error)
            return NextResponse.json({visitors: 0,lastUsers: []})
        }
    }

    // Fallback to file system (Local Development)
    const data=await getStatsFromFile()
    data.visitors=(data.visitors||0)+1
    await saveStatsToFile(data)
    return NextResponse.json(data)
}

export async function POST(request: Request) {
    const body=await request.json()
    const {username}=body

    if(!username) {
        return NextResponse.json({error: 'Username is required'},{status: 400})
    }

    if(USE_KV) {
        try {
            // Fetch current list to check for case-insensitive duplicates
            const currentList: string[]=await kv.lrange('last_users',0,-1)||[]

            // Find items to remove (same username, different case)
            const itemsToRemove=currentList.filter((u: string) => u.toLowerCase()===username.toLowerCase())

            // Remove them
            for(const item of itemsToRemove) {
                await kv.lrem('last_users',0,item)
            }

            // Add to beginning
            await kv.lpush('last_users',username)
            // Keep only last 10
            await kv.ltrim('last_users',0,9)

            const visitors=await kv.get<number>('visitors')||0
            const lastUsers=await kv.lrange('last_users',0,9)

            return NextResponse.json({visitors,lastUsers: lastUsers||[]})
        } catch(error) {
            console.error("KV Error:",error)
            return NextResponse.json({error: 'Failed to update stats'},{status: 500})
        }
    }

    // Fallback to file system
    const data=await getStatsFromFile()

    // Remove if exists to move to top
    const filteredUsers=(data.lastUsers||[]).filter(u => u.toLowerCase()!==username.toLowerCase())

    // Add to beginning
    filteredUsers.unshift(username)

    // Keep only last 10
    data.lastUsers=filteredUsers.slice(0,10)

    await saveStatsToFile(data)

    return NextResponse.json(data)
}

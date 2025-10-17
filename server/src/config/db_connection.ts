import {PrismaClient} from '@prisma/client'

export const prisma = new PrismaClient();

const connect_db = async()=>{
    try {
        await prisma.$connect();
        console.log('Database Connnected Successfully...');
    } catch (error) {
        if(error instanceof Error)
        {
            console.error(error.message)
        }
        else
        {
            console.error((error as any).message);
        }
        process.exit(1);
    }
}

export default connect_db;
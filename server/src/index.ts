import app from './app.js'
import connect_db , { prisma } from './config/db_connection.js';

const PORT : number|string = process.env.PORT || 5000;

connect_db()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server started listening to ${PORT}`)
    })
})
.catch((error)=>{
    if(error instanceof Error)
    {
        console.error(error.message)
    }
    else
    {
        console.error((error as any).message);
    }
    prisma.$disconnect();
    console.log('Server Connection Unsuccessfull ... ');
})
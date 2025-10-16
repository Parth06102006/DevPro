import app from './app.js'

const PORT : number|string = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server started listening to ${PORT}`)
})
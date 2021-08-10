import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import mongoData from './mongoData'
import Pusher from 'pusher'


const app = express()
const port = process.env.Port || 9000

app.use(cors())
app.use(express.json())

const mongoURI = 'mongodb+srv://chat_62:cluster062@cluster0.quycy.mongodb.net/chatDB?retryWrites=true&w=majority'

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.once('open', ()=> {
    console.log('DB connected')
})
app.get('/',(req,res)=> res.status(200).send('hello nishi'))


app.post('/new/channel',(req,res)=>{
    const dbData = req.body


    mongoData.create(dbData, (err, data)=>{
        if(err)
        {
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

app.post('/new/message',(req,res) =>{
const id = req.query.id
const newMessage = req.body

mongoData.update(
    {_id: id},
    { $push: {conversation: newMessage} },
    (err,data)=>{
        if(err)
        {
          res.status(500).send(err)
        }else{
          res.status(200).send(data)
        }

    })

})

app.get('/get/channelList',(req,res)=>{
    mongoData.find((err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            let channels = []

            data.map((channelData)=> {
                const channelInfo = {
                    id: channelData._id,
                    name: channelData.channelName
                }

                channels.push(channelInfo)
            })

            res.status(200).send(channels)
        }
    })
})

app.get('/get/coversation', (req,res)=>{
    const id = req.query.id

    mongoData.find({_id:id}, (err,data)=>{
        if(err)
        {
          res.status(500).send(err)
        }else {
           res.status(200).send(data)
        }
    })


})

//listen
app.listen(port, ()=> console.log(`listening on localHost:${port}`))
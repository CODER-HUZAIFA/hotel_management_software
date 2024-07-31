import { createClient } from 'redis';

const client = createClient({
    password: 'wX9pcuPOgdse8V2DvxWnhTTaXaybvETY',
    socket: {
        host: 'redis-17325.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 17325
    }
});

client.connect()
    .then((cl) => {
        console.log("Client is connected")
})

function flushDb() {
    
}

export {
    client,
    flushDb
}
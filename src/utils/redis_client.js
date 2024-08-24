import { createClient } from 'redis';

const client = createClient({
    password: 'I0BcXOkF6IvKaSk1EZWiXpDGL6DadmO6',
    socket: {
        host: 'redis-11246.c264.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 11246
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
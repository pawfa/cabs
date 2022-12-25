import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import {Client, connect} from 'stompit';

const connectOptions = {
    'host': 'localhost',
    'port': 61613,
    'connectHeaders':{
        'host': '/',
        'login': 'username',
        'passcode': 'password',
        'heart-beat': '5000,5000'
    }
};

export class GoogleCloudPubSubClient extends ClientProxy {
    private client: Client;

    async connect(): Promise<any> {

        this.client = await new Promise((resolve)=> {
            connect(connectOptions, function(error,client) {

                if (error) {
                    console.log('connect error ' + error.message);
                    return;
                }

                resolve(client)
            });
        });
    }

    async close() {
        console.log('close');
    }

    async dispatchEvent(packet: ReadPacket<any>): Promise<any> {
        console.log('message:', packet);

        const sendHeaders = {
            'destination': '/topic/main',
            'content-type': 'text/plain'
        };

        const frame = this.client.send(sendHeaders);
        console.log(JSON.stringify(packet).toString())
        frame.write(JSON.stringify(packet).toString());
        frame.end();
        this.client.disconnect()
    }

    publish(
        packet: ReadPacket<any>,
        callback: (packet: WritePacket<any>) => void,
    ): ()=> void {
        // In a real-world application, the "callback" function should be executed
        // with payload sent back from the responder. Here, we'll simply simulate (5 seconds delay)
        // that response came through by passing the same "data" as we've originally passed in.
        // setTimeout(() => callback({ response: packet.data }), 5000);

        return () => console.log('teardown');
    }
}
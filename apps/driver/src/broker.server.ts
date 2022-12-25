import {CustomTransportStrategy, Server} from "@nestjs/microservices";
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
export class BrokerPubSubServer
    extends Server
    implements CustomTransportStrategy {

    private client: Client;
    /**
     * This method is triggered when you run "app.listen()".
     */
    async listen(callback: () => void) {
        console.log('Connecting to broker')
        console.log(this.messageHandlers)
        this.client = await new Promise((resolve)=> {
            connect(connectOptions, (error,client) => {

                if (error) {
                    console.log('connect error ' + error.message);
                    return;
                }
                console.log("Connected to broker")
                const subscribeHeaders = {
                    'destination': '/topic/main',
                    'ack': 'client-individual'
                };

                client.subscribe(subscribeHeaders, (error, message)=> {

                    if (error) {
                        console.log('subscribe error ' + error.message);
                        return;
                    }

                    console.log("Subscribed to broker")
                    message.readString('utf-8', (error, body)=> {

                        if (error) {
                            console.log('read message error ' + error.message);
                            return;
                        }

                        console.log('received message: ' + body);

                        const parsedBody = JSON.parse(body)
                        const handler = this.messageHandlers.get(parsedBody.pattern)
                        handler && handler(parsedBody.data)
                        client.ack(message);

                        // client.disconnect();
                    });
                });
                resolve(client)
            });
        });

        callback();
    }

    /**
     * This method is triggered on application shutdown.
     */
    close() {}
}
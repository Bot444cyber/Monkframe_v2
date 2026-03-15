import { poolConnection } from '../../../db';

async function DisconnectDB() {
    try {
        await poolConnection.end();
        console.log('Database disconnected successfully!');
    }
    catch (error) {
        console.error('Disconnection error:', error);
    }
}

export default DisconnectDB;
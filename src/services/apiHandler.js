import { EventEmitter, once } from 'events';
import https from 'https';
import logger from '../loaders/logger';
import Importer from './importer';

const ApiHandler = {
  GetPatronsFromApi: async (apiUrl, apiKey, serviceId) => {
    const dataEmitter = new EventEmitter();
    const packActive = async data => {
      await Importer.ImportData(serviceId, data);
      logger.info('Active users updated');
    };
    const packInactive = async data => {
      await Importer.UpdateInactive(data);
      logger.info('Inactive users updated');
    };
    dataEmitter.on('error', e => {
      dataEmitter.off('activeRecieved', packActive);
      dataEmitter.off('inactiveRecieved', packInactive);
      throw new Error(`Data Emitter failed:\n${e}`);
    });

    const output = Promise.all([
      once(dataEmitter, 'activeRecieved'),
      once(dataEmitter, 'inactiveRecieved')
    ]).then(async data => {
      await packActive(data[0][0].results);
      await packInactive(data[1][0].results);
    }).then(() => 'db updated from api')
      .catch(e => {
        throw new Error(`error while fetching data from API:\n${e}`);
      });

    ApiHandler.ExternalRequest(
      (apiUrl + 'active'), `token ${apiKey}`,
      dataEmitter, 'activeRecieved'
    );
    ApiHandler.ExternalRequest(
      (apiUrl + 'inactive'), `token ${apiKey}`,
      dataEmitter, 'inactiveRecieved'
    );

    await output;
    return output;
  },

  ExternalRequest: (extUrl, authString, emitter, eventName) => {
    let recievedData = '';
    const options = {
      headers: {
        Authorization: authString,
        'Content-Type': 'application/json'
      }
    };
    const extRequest = https.request(extUrl, options, res => {
      res.on('data', data => {
        recievedData += data;
      });
      res.on('end', () => {
        recievedData = JSON.parse(recievedData);
        logger.debug(`emitting ${eventName}`);
        emitter.emit(eventName, recievedData);
      });
      res.on('error', e => {
        throw new Error(`Error in external response:\n${e}`);
      });
    });
    extRequest.on('error', e => {
      throw new Error(`Error in external request:\n${e}`);
    });
    extRequest.end();
  }
};

export { ApiHandler };

import logger from '../loaders/logger';
import PatronsMngr from './patronInServiceManager';

const Importer = {
  dataMap: new Map([
    ['Nazwa patrona', 'name'],
    ['Email', 'email'],
    ['Kwota', 'supportAmount'],
    ['Ostatnia wpłata', 'updatedAt']
  ]),

  conversionMap: new Set([
    'supportAmount'
  ]),

  FormatEntry: (entry) => {
    const patron = {};
    for (const key of Object.keys(entry)) {
      const pos = Importer.dataMap.get(key);
      if (pos) {
        let val = entry[key];
        if (Importer.conversionMap.has(pos)) {
          val = Number.parseInt(val, 10);
        }
        patron[pos] = val;
      }
    }
    patron.active = true;
    return patron;
  },

  FormatBatch: (data) => {
    const patrons = [];
    for (const entry of data) {
      const patron = Importer.FormatEntry(entry);
      patrons.push(patron);
    }
    return patrons;
  },

  InjectBatch: async (serviceId, patrons) => {
    const addedPatrons = [];
    for (const patron of patrons) {
      const addedPatron = await PatronsMngr.AddNewPatron(serviceId, patron);
      addedPatrons.push(addedPatron);
    }
    return addedPatrons;
  },

  ImportData: async (serviceId, data) => {
    const formattedData = Importer.FormatBatch(data);
    try {
      const addedPatrons = await Importer.InjectBatch(serviceId, formattedData);
      return addedPatrons;
    } catch (e) {
      logger.error('Error while injecting batch data to db');
      logger.error(e);
    }
  }
};

export default Importer;

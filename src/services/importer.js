import logger from '../loaders/logger';
import PatronsMngr from './patronInServiceManager';

// @TODO: should filter existing patrons
// and set active: false for those that aren't on new list

const Importer = {
  dataMap: new Map([
    ['Nazwa patrona', 'name'],
    ['Email', 'email'],
    ['Kwota', 'supportAmount'],
    ['Ostatnia wpłata', 'updatedAt']
  ]),

  apiDataMap: new Map([
    ['name', 'name'],
    ['email', 'email'],
    ['firstName', 'firstName'],
    ['lastName', 'lastName'],
    ['amount', 'supportAmount'],
    ['lastPaymentAt', 'lastPayment'],
    ['surchargeToAmount', 'surcharge'],
    ['totalMonths', 'totalMonths'],
    ['totalAmount', 'totalAmount'],
    ['endDate', 'endDate']

  ]),

  conversionMap: new Set([
    'supportAmount'
  ]),

  FormatEntry: (entry) => {
    const patron = {};
    for (const key of Object.keys(entry)) {
      const pos = Importer.apiDataMap.get(key);
      if (pos) {
        let val = entry[key];
        if (Importer.conversionMap.has(pos)) {
          val = Number.parseInt(val, 10);
        }
        patron[pos] = val;
      }
    }
    if (patron.endDate === '-') patron.endDate = Date.now();
    if (patron.surcharge === null) patron.surcharge = 0;
    patron.active = (entry.status === 'aktywna');
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

  UpdateInactive: async (data) => {
    for (const patron of data) {
      await PatronsMngr.EditActiveByMail(patron.email, false);
    }
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

const Collection = require('../Data_Model/new/Collection');
const NewDataValue = require('../Data_Model/new/Data_Value');

describe('Collection compatibility with new Data_Value', () => {
  test('should accept new Data_Value instances without re-wrapping', () => {
    const coll = new Collection();
    const dv = new NewDataValue(55);
    coll.push(dv);
    const item = coll.get(0);
    // Should be the original new Data_Value instance
    expect(item).toBe(dv);
    expect(item.value).toBe(55);
  });

  test('should emit change events when new Data_Value pushes', (done) => {
    const coll = new Collection();
    coll.on('change', (e) => {
      expect(e.name).toBe('insert');
      done();
    });
    const dv = new NewDataValue('cat');
    coll.push(dv);
  });
});

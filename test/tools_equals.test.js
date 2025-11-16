const {more_general_equals} = require('../Data_Model/new/tools');
const NewDataValue = require('../Data_Model/new/Data_Value');
const ImmutableDataValue = require('../Data_Model/new/Immutable_Data_Value');

describe('tools.more_general_equals - equality checks', () => {
  test('primitives equality', () => {
    expect(more_general_equals(1, 1)).toBe(true);
    expect(more_general_equals(1, '1')).toBe(false);
    expect(more_general_equals('a', 'a')).toBe(true);
  });

  test('array deep equality', () => {
    expect(more_general_equals([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(more_general_equals([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  test('Data_Value equality via toJSON', () => {
    const dv1 = new NewDataValue(10);
    const dv2 = new NewDataValue(10);
    const dv3 = new NewDataValue(11);
    expect(more_general_equals(dv1, dv2)).toBe(true);
    expect(more_general_equals(dv1, dv3)).toBe(false);
  });

  test('Immutable_Data_Value equality', () => {
    const dv1 = new NewDataValue(20);
    const imm = dv1.toImmutable();
    const imm2 = new ImmutableDataValue({value: 20});
    expect(more_general_equals(imm, imm2)).toBe(true);
  });
});

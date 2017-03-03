'use strict';
import hexToAscii from '../hexToAscii';

test('hexToAscii(hexArg) - returns hex argument converted to string', () => {
    expect(hexToAscii('38312E393230303030303037313431313237')).toEqual('81.920000007141127');
});
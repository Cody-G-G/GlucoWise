'use strict';

let Realm = () => {
};
Realm.prototype.constructor = jest.fn();
Realm.prototype.objects = jest.fn();
Realm.prototype.write = jest.fn((callback) => {
    callback();
});
Realm.prototype.create = jest.fn();
Realm.prototype.delete = jest.fn();

export default Realm;
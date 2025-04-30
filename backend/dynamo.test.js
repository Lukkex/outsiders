const { mockClient } = require ('aws-sdk-client-mock');
const { GetItemCommand, PutItemCommand, ScanCommand, UpdateItemCommand, DeleteItemCommand } = require ('@aws-sdk/client-dynamodb');
const { dynamoDB } = require ('./awsConfig');
const dbservice = require ("./awsServices/dynamoDB.js");

const mock = mockClient(dynamoDB);

beforeEach (() => {
    mock.reset();
});

test("checkUserExist, if exists return ture", async () => {
    mock.on(GetItemCommand).resolves({
        Item: {userID: {S: '123' } }
    });
    const exists = await dbservice.checkUserExists({S: '123'});
    expect(exists).toBe(true);
});

test("checkUserExist, if not exists return false", async () => {
    mock.on(GetItemCommand).resolves({
        Item: {userID: {S: '123' } }
    });
    const exists = await dbservice.checkUserExists({S: '123'});
    expect(exists).toBe(true);
});

test("getUserList return list of users", async () => {
    const user = [
        {userID: {S: '777'}}
    ];

    mock.on(ScanCommand).resolves({Items: user});
    const result = await dbservice.getUserList();
    expect(result).toEqual(user);
});

test("getUserList return empty if none", async () => {
    mock.on(ScanCommand).resolves({Items: []});
    const result = await dbservice.getUserList();
    expect(result).toEqual([]);
});

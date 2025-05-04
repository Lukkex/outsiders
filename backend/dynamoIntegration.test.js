
const { checkUserExists, addUserToTable, getUserByID} = require ('./awsServices/dynamoDB.js');

test("returns true if user exists", async () => {
const exist = await checkUserExists("777");
expect(exist).toBe(true);
});


test("get user by id", async () => {
    const getuser = await getUserByID("777");
    expect(getuser.userID.S).toEqual("777");
});

test("add user to table", async () => {
    await addUserToTable("444", "fn", "ln", "em");
    const user = await getUserByID("444");
    expect(user).toEqual({userID:{S:"444"}, firstName:{S:"fn"}, lastName:{S:"ln"}, email:{S:"em"}});
});

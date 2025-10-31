import { assert } from "chai";
import { playtimeService } from "./playtime-service.js";
import { decodeToken } from "../../src/api/jwt-utils.js";
import { authUser } from "../fixtures.js";

suite("Authentication API tests", async () => {
  setup(async () => {
    await playtimeService.createUser(authUser);
    await playtimeService.authenticate(authUser);
    await playtimeService.deleteAllUsers();
    await playtimeService.clearAuth();
  });
  teardown(async () => {});

  test("authenticate", async () => {
    const returnedUser = await playtimeService.createUser(authUser);
    const response = await playtimeService.authenticate(authUser);
    assert(response.success);
    assert.isDefined(response.token);
  });

  test("verify Token", async () => {
    const returnedUser = await playtimeService.createUser(authUser);
    const response = await playtimeService.authenticate(authUser);

    const userInfo = decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });

  test("check Unauthorized", async () => {
    playtimeService.clearAuth();
    try {
      await playtimeService.deleteAllUsers();
      assert.fail("Route not protected");
    } catch (error) {
      console.log(error.response.data);
      assert.equal(error.response.data.statusCode, 401);
    }
  });
});

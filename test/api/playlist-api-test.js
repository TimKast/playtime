import { assert } from "chai";
import { testPlaylists, vivaldi } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";
import { playtimeService } from "./playtime-service.js";

suite("Playlist API tests", () => {
  setup(async () => {
    await playtimeService.deleteAllPlaylists();
    for (let i = 0; i < testPlaylists.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPlaylists[i] = await playtimeService.createPlaylist(testPlaylists[i]);
    }
  });
  after(async () => {});

  test("create a playlist", async () => {
    const newPlaylist = await playtimeService.createPlaylist(vivaldi);
    assert.isTrue(assertSubset(vivaldi, newPlaylist));
    assert.isDefined(newPlaylist._id);
  });

  test("delete all playlists", async () => {
    let returnedPlaylists = await playtimeService.getAllPlaylists();
    assert.equal(returnedPlaylists.length, 3);
    await playtimeService.deleteAllPlaylists();
    returnedPlaylists = await playtimeService.getAllPlaylists();
    assert.equal(returnedPlaylists.length, 0);
  });

  test("get all playlists", async () => {
    const returnedPlaylists = await playtimeService.getAllPlaylists();
    assert.equal(returnedPlaylists.length, 3);
  });

  test("get a playlist - success", async () => {
    const returnedPlaylist = await playtimeService.getPlaylist(testPlaylists[0]._id);
    assert.deepEqual(testPlaylists[0], returnedPlaylist);
  });

  test("get a playlist - bad id", async () => {
    try {
      const returnedPlaylist = await playtimeService.getPlaylist("bad-id");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Playlist with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("get a playlist - deleted playlist", async () => {
    await playtimeService.deleteAllPlaylists();
    try {
      await playtimeService.getPlaylist(testPlaylists[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Playlist with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});

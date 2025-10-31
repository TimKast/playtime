import { assert } from "chai";
import { EventEmitter } from "events";
import { authUser, testTracks, violin, violinConcerto } from "../fixtures.js";
import { playtimeService } from "./playtime-service.js";
import { assertSubset } from "../test-utils.js";

EventEmitter.setMaxListeners(25);

const tracks = new Array(testTracks.length);

suite("Track API tests", () => {
  let playlist = null;

  setup(async () => {
    await playtimeService.clearAuth();
    await playtimeService.createUser(authUser);
    await playtimeService.authenticate(authUser);
    await playtimeService.deleteAllPlaylists();
    await playtimeService.deleteAllTracks();
    playlist = await playtimeService.createPlaylist(violin);
    for (let i = 0; i < testTracks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      tracks[i] = await playtimeService.createTrack(playlist._id, testTracks[i]);
    }
  });
  teardown(async () => {});

  test("create a track", async () => {
    const newTrack = await playtimeService.createTrack(playlist._id, violinConcerto);
    assert.isTrue(assertSubset(violinConcerto, newTrack));
    assert.isDefined(newTrack._id);
  });

  test("delete all tracks", async () => {
    let returnedTracks = await playtimeService.getAllTracks();
    assert.equal(returnedTracks.length, 3);
    await playtimeService.deleteAllTracks();
    returnedTracks = await playtimeService.getAllTracks();
    assert.equal(returnedTracks.length, 0);
  });

  test("get a track - success", async () => {
    const track = await playtimeService.getTrack(tracks[0]._id);
    assert.deepEqual(track, tracks[0]);
  });

  test("get a track - bad id", async () => {
    try {
      await playtimeService.getTrack("bad-id");
      assert.fail("should not get response");
    } catch (error) {
      assert(error.response.data.message === "No Track with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("get a track - deleted", async () => {
    await playtimeService.deleteAllTracks();
    try {
      await playtimeService.getTrack(tracks[0]._id);
      assert.fail("should not get response");
    } catch (error) {
      assert(error.response.data.message === "No Track with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});

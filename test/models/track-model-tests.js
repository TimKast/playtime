import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testPlaylists, testTracks, fourSeasons, violin, vivaldi, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Track Model tests", () => {
  let playlist = null;

  setup(async () => {
    db.init("mongo");
    await db.playlistStore.deleteAllPlaylists();
    await db.trackStore.deleteAllTracks();
    playlist = await db.playlistStore.addPlaylist(violin);
    for (let i = 0; i < testTracks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testTracks[i] = await db.trackStore.addTrack(playlist._id, testTracks[i]);
    }
  });

  teardown(async () => {});

  test("create single track", async () => {
    const vivaldiList = await db.playlistStore.addPlaylist(vivaldi);
    const track = await db.trackStore.addTrack(vivaldiList._id, fourSeasons);
    assert.isNotNull(track._id);
    assert.isTrue(assertSubset(fourSeasons, track));
  });

  test("get multiple tracks", async () => {
    const tracks = await db.trackStore.getTracksByPlaylistId(playlist._id);
    assert.equal(tracks.length, testTracks.length);
  });

  test("delete all tracks", async () => {
    const tracks = await db.trackStore.getAllTracks();
    assert.equal(testTracks.length, tracks.length);
    await db.trackStore.deleteAllTracks();
    const newTracks = await db.trackStore.getAllTracks();
    assert.equal(0, newTracks.length);
  });

  test("get a track - success", async () => {
    const vivaldiList = await db.playlistStore.addPlaylist(vivaldi);
    const track = await db.trackStore.addTrack(vivaldiList._id, fourSeasons);
    const newTrack = await db.trackStore.getTrackById(track._id);
    assert.isTrue(assertSubset(fourSeasons, newTrack));
  });

  test("delete One Track - success", async () => {
    await db.trackStore.deleteTrack(testTracks[0]._id);
    const tracks = await db.trackStore.getAllTracks();
    assert.equal(tracks.length, testPlaylists.length - 1);
    const deletedTrack = await db.trackStore.getTrackById(testTracks[0]._id);
    assert.isNull(deletedTrack);
  });

  test("get a track - bad params", async () => {
    assert.isNull(await db.trackStore.getTrackById(""));
    assert.isNull(await db.trackStore.getTrackById());
  });

  test("delete one track - fail", async () => {
    await db.trackStore.deleteTrack("bad-id");
    const tracks = await db.trackStore.getAllTracks();
    assert.equal(tracks.length, testPlaylists.length);
  });
});

import mongoose from "mongoose";
import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testPlaylists, violin } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Playlist Model", () => {
  setup(async () => {
    db.init("mongo");
    await db.playlistStore.deleteAllPlaylists();
  });

  after(async () => {
    await mongoose.disconnect();
  });

  test("Add a playlist", async () => {
    const playlist = await db.playlistStore.addPlaylist({
      name: "My Playlist",
    });
    assertSubset(playlist.name, "My Playlist");
  });

  test("Delete all playlists", async () => {
    for (let i = 0; i < testPlaylists.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await db.playlistStore.addPlaylist(testPlaylists[i]);
    }
    let returnedPlaylists = await db.playlistStore.getAllPlaylists();
    assert.equal(returnedPlaylists.length, 3);
    await db.playlistStore.deleteAllPlaylists();
    returnedPlaylists = await db.playlistStore.getAllPlaylists();
    assert.equal(returnedPlaylists.length, 0);
  });

  test("get a playlist - success", async () => {
    const playlist = await db.playlistStore.addPlaylist(violin);
    const returnedPlaylist = await db.playlistStore.getPlaylistById(playlist._id);
    assertSubset(violin, returnedPlaylist);
  });

  test("Delete one playlist - success", async () => {
    for (let i = 0; i < testPlaylists.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPlaylists[i] = await db.playlistStore.addPlaylist(testPlaylists[i]);
    }
    await db.playlistStore.deletePlaylistById(testPlaylists[0]._id);
    const returnedPlaylists = await db.playlistStore.getAllPlaylists();
    assert.equal(returnedPlaylists.length, testPlaylists.length - 1);
  });

  test("Get a playlist - failure", async () => {
    const returnedPlaylist = await db.playlistStore.getPlaylistById("bad-id");
    assert.isNull(returnedPlaylist);
  });

  test("Get a playlist - bad params", async () => {
    let nullPlaylist = await db.playlistStore.getPlaylistById("");
    assert.isNull(nullPlaylist);
    nullPlaylist = await db.playlistStore.getPlaylistById();
    assert.isNull(nullPlaylist);
  });

  test("Delete one playlist - fail", async () => {
    for (let i = 0; i < testPlaylists.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPlaylists[i] = await db.playlistStore.addPlaylist(testPlaylists[i]);
    }
    await db.playlistStore.deletePlaylistById("bad-id");
    const returnedPlaylists = await db.playlistStore.getAllPlaylists();
    assert.equal(returnedPlaylists.length, testPlaylists.length);
  });
});

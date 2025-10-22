// eslint-disable-next-line import/no-unresolved
import { v4 } from "uuid";
import { trackMemStore } from "./track-mem-store.js";

let playlists = [];

export const playlistMemStore = {
  async getAllPlaylists() {
    return playlists;
  },

  async addPlaylist(playlist) {
    playlist._id = v4();
    playlists.push(playlist);
    return playlist;
  },

  async getPlaylistById(id) {
    let list = playlists.find((playlist) => playlist._id === id);
    if (list === undefined) list = null;
    else list.tracks = await trackMemStore.getTracksByPlaylist(list._id);
    return list;
  },

  async getUserPlaylists(userId) {
    return playlists.filter((playlist) => playlist.userId === userId);
  },

  async deletePlaylistById(id) {
    const index = playlists.findIndex((playlist) => playlist._id === id);
    if (index !== -1) playlists.splice(index, 1);
  },

  async deleteAllPlaylists() {
    playlists = [];
  },
};

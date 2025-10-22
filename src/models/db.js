import { playlistJsonStore } from "./json/playlist-json-store.js";
import { userJsonStore } from "./json/user-json-store.js";
import { trackJsonStore } from "./json/track-json-store.js";

import { playlistMemStore } from "./mem/playlist-mem-store.js";
import { userMemStore } from "./mem/user-mem-store.js";
import { trackMemStore } from "./mem/track-mem-store.js";

export const db = {
  userStore: null,
  playlistStore: null,
  trackStore: null,

  init(storeType) {
    switch (storeType) {
      case "json":
        this.userStore = userJsonStore;
        this.playlistStore = playlistJsonStore;
        this.trackStore = trackJsonStore;
        break;
      default:
        this.userStore = userMemStore;
        this.playlistStore = playlistMemStore;
        this.trackStore = trackMemStore;
    }
  },
};

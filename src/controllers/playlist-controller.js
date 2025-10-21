import { db } from "../models/db.js";

export const playlistController = {
  index: {
    handler: async function (request, h) {
      const { id } = request.params;
      const playlist = await db.playlistStore.getPlaylistById(id);
      return h.view("playlist-view", { playlist });
    },
  },

  addTrack: {
    handler: async function (request, h) {
      const { id } = request.params;
      const newTrack = {
        title: request.payload.title,
        artist: request.payload.artist,
        duration: request.payload.duration,
      };
      await db.trackStore.addTrack(newTrack, id);
      return h.redirect(`/playlist/${id}`);
    },
  },

  deleteTrack: {
    handler: async function (request, h) {
      const { id } = request.params;
      const track = await db.trackStore.getTrackById(id);
      await db.trackStore.deleteTrackById(id);
      return h.redirect(`/playlist/${track.playlistId}`);
    },
  },
};

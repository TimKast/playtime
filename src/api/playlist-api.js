import Boom from "@hapi/boom";
import { db } from "../models/db.js";

export const playlistApi = {
  create: {
    auth: false,
    handler: async function (request, h) {
      const playlist = await db.playlistStore.addPlaylist(request.payload);
      return h.response(playlist).code(201);
    },
  },

  find: {
    auth: false,
    handler: async function (request, h) {
      const list = await db.playlistStore.getAllPlaylists();
      return h.response(list).code(200);
    },
  },

  findOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const playlist = await db.playlistStore.getPlaylistById(request.params.id);
        console.log("Fetched playlist:", playlist);
        if (!playlist) {
          return Boom.notFound("No Playlist with this id");
        }
        return h.response(playlist).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Something went wrong");
      }
    },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      await db.playlistStore.deleteAllPlaylists();
      return h.response().code(204);
    },
  },
};

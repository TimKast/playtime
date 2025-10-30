import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { PlaylistArray, PlaylistSpec, IdSpec, PlaylistSpecPlus } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";

export const playlistApi = {
  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const playlist = await db.playlistStore.addPlaylist(request.payload);
        if (!playlist) {
          return Boom.badImplementation("error creating playlist");
        }
        return h.response(playlist).code(201);
      } catch (err) {
        // console.log(err);
        return Boom.serverUnavailable("Something went wrong");
      }
    },
    tags: ["api"],
    description: "Create a new playlist",
    notes: "This endpoint creates a new playlist in the system.",
    validate: { payload: PlaylistSpec, failAction: validationError },
    response: { schema: PlaylistSpecPlus, failAction: validationError },
  },

  find: {
    auth: false,
    handler: async function (request, h) {
      try {
        const list = await db.playlistStore.getAllPlaylists();
        return h.response(list).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Something went wrong");
      }
    },
    tags: ["api"],
    description: "Get all playlists",
    notes: "This endpoint retrieves all playlists from the system.",
    response: { schema: PlaylistArray, failAction: validationError },
  },

  findOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const playlist = await db.playlistStore.getPlaylistById(request.params.id);
        if (!playlist) {
          return Boom.notFound("No Playlist with this id");
        }
        return h.response(playlist).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Something went wrong");
      }
    },
    tags: ["api"],
    description: "Get a specific playlist",
    notes: "This endpoint retrieves a playlist by their id.",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: PlaylistSpecPlus, failAction: validationError },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.playlistStore.deleteAllPlaylists();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Something went wrong");
      }
    },
    tags: ["api"],
    description: "Delete all playlists",
    notes: "This endpoint deletes all playlists from the system.",
  },
};

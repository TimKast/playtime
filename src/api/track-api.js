import Boom from "@hapi/boom";
import { db } from "../models/db.js";

export const trackApi = {
  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const track = await db.trackStore.addTrack(request.params.id, request.payload);
        if (!track) {
          return Boom.badImplementation("error creating track");
        }
        return h.response(track).code(201);
      } catch (error) {
        return Boom.serverUnavailable("Something went wrong");
      }
    },
  },

  find: {
    auth: false,
    handler: async function (request, h) {
      try {
        const list = await db.trackStore.getAllTracks();
        return h.response(list).code(200);
      } catch (error) {
        return Boom.serverUnavailable("Something went wrong");
      }
    },
  },

  findOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const track = await db.trackStore.getTrackById(request.params.id);
        if (!track) {
          return Boom.notFound("No Track with this id");
        }
        return h.response(track).code(200);
      } catch (error) {
        return Boom.serverUnavailable("Something went wrong");
      }
    },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.trackStore.deleteAllTracks();
        return h.response().code(204);
      } catch (error) {
        return Boom.serverUnavailable("Something went wrong");
      }
    },
  },
};

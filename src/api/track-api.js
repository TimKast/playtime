import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { TrackArray, TrackSpec, TrackSpecPlus, IdSpec } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";

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
    tags: ["api"],
    description: "Create a new track",
    notes: "This endpoint creates a new track in the system.",
    validate: { params: { id: IdSpec }, payload: TrackSpec, failAction: validationError },
    response: { schema: TrackSpecPlus, failAction: validationError },
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
    tags: ["api"],
    description: "Get all tracks",
    notes: "This endpoint retrieves all tracks from the system.",
    response: { schema: TrackArray, failAction: validationError },
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
    tags: ["api"],
    description: "Get a specific track",
    notes: "This endpoint retrieves a track by their id.",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: TrackSpecPlus, failAction: validationError },
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
    tags: ["api"],
    description: "Delete all tracks",
    notes: "This endpoint deletes all tracks from the system.",
  },
};

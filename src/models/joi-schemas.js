import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const JwtSpec = Joi.object()
  .keys({
    success: Joi.boolean().example(true).required(),
    token: Joi.string().required(),
  })
  .label("JwtDetails");

export const TrackSpec = Joi.object()
  .keys({
    title: Joi.string().example("The four Seasons").required(),
    artist: Joi.string().example("Vivaldi").required(),
    duration: Joi.number().example(11).required(),
    playlistId: IdSpec,
  })
  .label("TrackDetails");

export const TrackSpecPlus = TrackSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("TrackDetailsPlus");

export const TrackArray = Joi.array().items(TrackSpecPlus).label("TrackArray");

export const PlaylistSpec = Joi.object()
  .keys({
    title: Joi.string().example("Classical Music").max(50).required(),
    userId: IdSpec,
    tracks: TrackArray,
  })
  .label("PlaylistDetails");

export const PlaylistSpecPlus = PlaylistSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("PlaylistDetailsPlus");

export const PlaylistArray = Joi.array().items(PlaylistSpecPlus).label("PlaylistArray");

export const UserCredentialsSpec = Joi.object()
  .keys({
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
  })
  .label("UserCredentials");

export const UserSpec = UserCredentialsSpec.keys({
  firstName: Joi.string().example("Homer").required(),
  lastName: Joi.string().example("Simpson").required(),
}).label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("UserDetailsPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

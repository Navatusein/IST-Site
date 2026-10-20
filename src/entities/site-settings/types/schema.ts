import {model, models, Schema} from "mongoose";
import {ISiteSettings, SITE_SETTINGS_KEY} from "./type";

const socialLinkScheme = new Schema({
  network: {type: Schema.Types.String, required: true},
  url: {type: Schema.Types.String, required: true},
}, {_id: false});

const siteSettingsScheme = new Schema<ISiteSettings>({
  key: {type: Schema.Types.String, required: true, unique: true, default: SITE_SETTINGS_KEY},
  siteTitle: {type: Schema.Types.String},
  siteShortName: {type: Schema.Types.String},
  siteDescription: {type: Schema.Types.String},
  organizationName: {type: Schema.Types.String},
  workingHours: {type: Schema.Types.String},
  address: {type: Schema.Types.String},
  addressLink: {type: Schema.Types.String},
  email: {type: Schema.Types.String},
  phone: {type: Schema.Types.String},
  socialLinks: {type: [socialLinkScheme]},
  mapEmbedUrl: {type: Schema.Types.String},
  copyright: {type: Schema.Types.String},
}, {timestamps: true});

export {siteSettingsScheme};
export default models?.SiteSettings || model<ISiteSettings>("SiteSettings", siteSettingsScheme, "site-settings");

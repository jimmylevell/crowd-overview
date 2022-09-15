import mongoose, { Document, model, models, Model, Schema } from 'mongoose'
import db from '../utils/db'

export interface ISettings extends Document {
  number_of_start_points: number
  number_of_end_points: number
}

const SettingsSchema: Schema = new Schema(
  {
    number_of_start_points: Number,
    number_of_end_points: Number,
  },
  {
    collection: 'settings',
    timestamps: true,
  }
)

export const Settings: Model<ISettings> =
  models.Settings || model<ISettings>('Settings', SettingsSchema)

export async function createSettings(settings: ISettings) {
  await db
  return Settings.create(settings)
}

export async function updateSettings(settings: ISettings) {
  await db
  return Settings.updateOne({ _id: settings._id }, settings)
}

export async function getSettings() {
  await db
  return Settings.findOne({})
}

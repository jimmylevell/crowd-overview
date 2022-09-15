import { ISettings } from '../model/Settings'

export async function getSettings() {
  return fetch('/api/settings')
    .then((res) => res.json())
    .then((data) => {
      return data['settings']
    })
}

export async function createSettings(settings: ISettings) {
  return fetch('/api/settings', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ settings: settings }),
  })
    .then((res) => res.json())
    .then((data) => {
      return data['settings']
    })
}

export async function updateSettings(settings: ISettings) {
  return fetch('/api/settings/' + settings._id, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ settings: settings }),
  })
    .then((res) => res.json())
    .then((data) => {
      return data['settings']
    })
}

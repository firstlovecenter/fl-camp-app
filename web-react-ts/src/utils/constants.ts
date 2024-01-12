export const CAMP_ADMIN_ROLES_OPTIONS = [
  { key: 'Campus Admin', value: 'campusAdmin' },
  { key: 'Country Admin', value: 'countryAdmin' },
  { key: 'Continent Admin', value: 'continentAdmin' },
  { key: 'Global Admin', value: 'globalAdmin' },
]

export const CAMP_LEVEL_OPTIONS = [
  { key: 'Global', value: 'planet' },
  { key: 'Continent', value: 'continent' },
  { key: 'Country', value: 'country' },
  { key: 'Campus', value: 'campus' },
]

export const NO_USERS_FOUND_TEXT = 'No Users Found'

export const ROLE_MAPPINGS = {
  planet: {
    globalAdmin: ['Campus', 'Country', 'Continent', 'Global'],
    continentAdmin: ['Campus', 'Country', 'Continent'],
    countryAdmin: ['Campus', 'Country'],
    campusAdmin: ['Campus'],
  },
  continent: {
    globalAdmin: ['Campus', 'Country', 'Continent'],
    continentAdmin: ['Campus', 'Country'],
    countryAdmin: ['Campus'],
  },
  country: {
    globalAdmin: ['Country', 'Campus'],
    continentAdmin: ['Campus', 'Country'],
    countryAdmin: ['Campus'],
  },
  campus: {
    globalAdmin: ['Campus'],
  },
}

export const ROLE_WEIGHTS = [
  { role: 'globalAdmin', weight: 4 },
  { role: 'continentAdmin', weight: 3 },
  { role: 'countryAdmin', weight: 2 },
  { role: 'campusAdmin', weight: 1 },
]

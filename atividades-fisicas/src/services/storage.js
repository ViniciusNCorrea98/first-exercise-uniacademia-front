const ACTIVITIES_STORAGE_KEY = 'activities';

export function getActivities() {
  const storedActivities = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
  return storedActivities ? JSON.parse(storedActivities) : [];
}

export function saveActivities(activities) {
  localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities));
}

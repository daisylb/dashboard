## Getting Google Calendar working

- Set up a new GCP project
- Go to https://console.cloud.google.com/apis/library/caldav.googleapis.com and enable the CalDAV API
- Go to https://console.cloud.google.com/apis/credentials and create a new oAuth 2 Client ID for it. Give it access to the `.../auth/calendar.readonly` scope, and a redirect URI of `https://leigh-dashboard.netlify.app/.netlify/functions/gauth`.

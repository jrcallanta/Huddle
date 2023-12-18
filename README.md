## Prereq

- Set up a NEXTAUTH_SECRET using `openssl rand -base64 32`, and save for later.
  
- Set up a Google Application at [https://console.cloud.google.com/](https://console.cloud.google.com/)
- Enable the Maps API and create Map_ID.
- Enable the Places API.
- Save `MAPS_API_KEY` and `MAP_ID` for later.

## Setup

Make sure your environment variables are updated in the `.env` file

```
# For Next Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[YOUR_NEXTAUTH_SECRET]"
GOOGLE_ID="[YOUR_GOOGLE_ID]"
GOOGLE_SECRET="[YOUR_GOOGLE_SECRET]"

# For Mongo Database
DATABASE_URL="[YOUR_MONGO_DATABASE_URL]"

# For Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="[YOUR_GOOGLE_MAPS_API_KEY]"
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID="[YOUR_GOOGLE_MAPS_MAP_ID]"
PLACES_URL="https://maps.googleapis.com/maps/api/js?key=[YOUR_GOOGLE_MAPS_API_KEY]&libraries=places&callback=initMap"
```

## Running the Application
In the `root` directory, run `npm run dev`

Open [http://localhost:3000](http://localhost:3000) to see the running application.

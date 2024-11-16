"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

interface Location {
  latitude?: number;
  longitude?: number;
}

export default function Home() {
  const location = useRef<Location | null>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          location.current = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log("Current location:", location.current);
        },
        (error) => {
          console.error("Error getting current location:", error);
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        location.current = {
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        };
        console.log("Selected location:", location.current);
      }
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 px-5 font-sans text-gray-800">
      <header className="bg-blue-600 py-5 text-center text-white">
        <h1 className="text-4xl">GeoSafe</h1>
        <p className="mt-2 text-xl">Your Safety, Our Priority</p>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center py-5">
        <section className="mb-10 max-w-xl rounded-lg bg-white p-5 text-center shadow-md">
          <h2 className="mb-3 text-3xl">Welcome to GeoSafe</h2>
          <p className="mb-5 text-lg leading-relaxed">
            GeoSafe helps you stay informed about the safety of your current
            location. Whether you are traveling or staying local, we have got
            you covered.
          </p>
          <Popover>
            <PopoverTrigger className="cursor-pointer rounded-lg border-none bg-green-600 px-4 py-2 text-lg text-white transition duration-300 hover:bg-green-700">
              Check Your Safety Now
            </PopoverTrigger>
            <PopoverContent className="mb-10 rounded-lg bg-white p-5 text-center shadow-md">
              <Button className="mb-3 text-2xl" onClick={handleCurrentLocation}>
                Your Current Location
              </Button>
              {isLoaded && (
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                  <input
                    type="text"
                    placeholder="Enter location manually"
                    className="rounded border border-gray-300 p-2"
                  />
                </Autocomplete>
              )}
            </PopoverContent>
          </Popover>
        </section>

        <section className="mb-10 max-w-xl rounded-lg bg-white p-5 shadow-md">
          <h3 className="mb-4 text-center text-2xl">Why Choose GeoSafe?</h3>
          <ul className="list-none p-0">
            <li className="mb-2 flex items-center text-lg">
              Real-time Safety Alerts
            </li>
            <li className="mb-2 flex items-center text-lg">
              Accurate Location-based Information
            </li>
            <li className="mb-2 flex items-center text-lg">
              User-friendly and Easy to Use
            </li>
            <li className="mb-2 flex items-center text-lg">
              Available Anytime, Anywhere
            </li>
          </ul>
        </section>
      </main>

      <footer className="bg-gray-800 py-5 text-center text-white">
        <p className="text-lg">
          &copy; 2024 GeoSafe. All rights reserved. Need help?
        </p>
      </footer>

      <LoadScript
        googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY"
        libraries={["places"]}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

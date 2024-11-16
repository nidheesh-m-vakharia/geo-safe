"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import Image from "next/image";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import styles from "./page.module.css";

interface Location {
  latitude?: number;
  longitude?: number;
}

export default function Home() {
  let location = useRef<Location | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          location.current = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
    console.log("Current location:", location);
  };

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        location.current={
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        };
      }
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
    console.log("Selected location:", location);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>GeoSafe</h1>
        <p className={styles.subtitle}>Your Safety, Our Priority</p>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.introSection}>
          <h2 className={styles.introTitle}>Welcome to GeoSafe</h2>
          <p className={styles.introText}>
            GeoSafe helps you stay informed about the safety of your current location.
            Whether you're traveling or staying local, we've got you covered.
          </p>
          <Popover>
            <PopoverTrigger className={styles.safetyButton} >
            Check Your Safety Now
            </PopoverTrigger>
            <PopoverContent className={styles.locationSection}>
            <Button className={styles.locationTitle} onClick={handleCurrentLocation}>Your Current Location</Button>
            {isLoaded && (
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <input
                type="text"
                placeholder="Enter location manually"
                className="p-2 border border-gray-300 rounded"
              />
              </Autocomplete>   
              )}     
            </PopoverContent>
          </Popover>
          
        </section>

        

        <section className={styles.featuresSection}>
          <h3 className={styles.featuresTitle}>Why Choose GeoSafe?</h3>
          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>Real-time Safety Alerts</li>
            <li className={styles.featureItem}>Accurate Location-based Information</li>
            <li className={styles.featureItem}>User-friendly and Easy to Use</li>
            <li className={styles.featureItem}>Available Anytime, Anywhere</li>
          </ul>
        </section>
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          &copy; 2024 GeoSafe. All rights reserved. Need help?
        </p>
      </footer>
      <LoadScript 
        googleMapsApiKey="AIzaSyClVxT2CUPTiAqHlomBjJxUNJjraBz8oJA" 
        libraries={["places"]}
        onLoad={() => setIsLoaded(true)}/>
    </div>
  );
}
/** @format */
"use client";

import React from "react";
import { MdOutlineLocationOn, MdWbSunny,MdMyLocation } from "react-icons/md";
import { BsFillMoonStarsFill } from "react-icons/bs";

import SearchBox from "./SearchBox";
import { useState } from "react";
import axios from "axios";
import { loadingCityAtom, placeAtom ,darkModeAtom} from "@/app/atom";
import { useAtom } from "jotai";
export default function Navbar() {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  //
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingCityAtom);
  const[darkMode,setDarkMode]=useAtom(darkModeAtom);
function toogleDarkMode() {
   setDarkMode(!darkMode);
}
  async function handleInputChang(value: string) {
    setCity(value);
    setShowSuggestions(true);
    setError('');
  }
  function handleSuggestionClick(value: string){
    setCity(()=>(value));
    setShowSuggestions(false);
    console.log(city); 
  }
  async function handleSubmiSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (city.length >= 3) { 
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_API_KEY}`
        );
       
        setLoadingCity(true);
        setPlace(city);
        const suggestion= response.data?.name;
        setSuggestions((prev)=>[...prev,suggestion]);
        setCity(''); 
      } catch (error) {
        setSuggestions([]);
        setError("City not found");
      }
    } 
    else {
      setSuggestions([]);
      setError("City not found"); 
    }

    {
    if (suggestions.length == 0) {
      setError("Location not found");
      setShowSuggestions(true)
    } 
    else {
      setError("");
      setShowSuggestions(false);
    }
    }
  }
  function handleCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (postiion) => {
        const { latitude, longitude } = postiion.coords;
        try {
          setLoadingCity(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_API_KEY}`
          );
          setTimeout(() => {
            setLoadingCity(false);
            setPlace(response.data.name);
          }, 500);
        } catch (error) {
          setLoadingCity(false);
        }
      });
    }
  }
  return (
    <>
      <nav className="shadow-sm  sticky top-0 left-0 z-50 bg-white dark:bg-black">
        <div className="h-[80px]     w-full    flex   justify-between items-center  max-w-7xl px-3 mx-auto">
          <div className="flex items-center justify-center gap-3  ">
            <div className="text-gray-500 text-3xl">Weather</div>
            <span onClick={toogleDarkMode}>{darkMode? <MdWbSunny className="text-3xl mt-1 text-yellow-300" />:<BsFillMoonStarsFill className="text-xl mt-1 text-dark"/>
            }</span>
           
          </div>
          {/*  */}
          <section className="flex gap-2 items-center">
            <MdMyLocation
              title="Your Current Location"
              onClick={handleCurrentLocation}
              className="text-2xl  text-gray-400 hover:opacity-80 cursor-pointer"
            />
            <MdOutlineLocationOn className="text-3xl dark:text-dark" />
            <p className="text-slate-900/80 text-sm dark:text-dark capitalize font-bold "> {place} </p>
            <div className="relative hidden md:flex">
              {/* SearchBox */}

              <SearchBox
                city={city}
                onSubmit={handleSubmiSearch}
                onChange={(e) => handleInputChang(e.target.value)}
                onBlur={()=>setShowSuggestions(false)}
              />
              <SuggetionBox
                showSuggestions={showSuggestions}
                suggestions={suggestions}
                handleSuggestionClick={handleSuggestionClick}
                error={error}
              />
            </div>
          </section>
        </div>
      </nav>
      <section className="flex   max-w-7xl px-3 md:hidden ">
        <div className="relative ">
          {/* SearchBox */}

          <SearchBox
            city={city}
            onSubmit={handleSubmiSearch}
            onChange={(e) => handleInputChang(e.target.value)}
            onBlur={()=>setShowSuggestions(false)}
          />
          <SuggetionBox
            showSuggestions={showSuggestions}
            suggestions={suggestions}
            handleSuggestionClick={handleSuggestionClick}
            error={error}
          />
        </div>
      </section>
    </>
  );
}

function SuggetionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {showSuggestions && (suggestions.length > 0 || error) && (
        <ul className="mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2 dark:bg-dark">
          {error && suggestions.length === 0 && (
            <li className="text-red-500 p-1"> {error}</li>
          )}
          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() =>{
                console.log("i am clicked");
                handleSuggestionClick(item); 
              }}
              className="cursor-pointer p-1 rounded hover:bg-gray-200"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

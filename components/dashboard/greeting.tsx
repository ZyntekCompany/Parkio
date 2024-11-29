"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface GreetingProps {
  userName: string;
}

export function Greeting({ userName }: GreetingProps) {
  const name = userName.split(" ")[0];
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();

      if (currentHour >= 5 && currentHour < 12) {
        setGreeting("Buenos días");
      } else if (currentHour >= 12 && currentHour < 18) {
        setGreeting("Buenas tardes");
      } else if (currentHour >= 18 && currentHour < 22) {
        setGreeting("Buenas noches");
      } else {
        setGreeting("Buenas noches");
      }
    };

    updateGreeting();
    const intervalId = setInterval(updateGreeting, 120000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className={cn(
        "flex items-center space-x-4 max-xs:px-2",
        !greeting && "hidden"
      )}
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        {greeting}, {name}
      </h1>
    </div>
  );
}

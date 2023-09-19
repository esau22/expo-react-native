import { useState, useEffect } from "react";
import { Audio } from "expo-av";

export default function UseTime() {
  const [isWorking, setIsWorking] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [currentTime, setCurrentTime] = useState("POMO" | "SHORT" | "BREAK");
  const [isActive, setIsActive] = useState(false);
  const [soundObject, setSoundObject] = useState(null);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime(time - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    if (time === 0) {
      setIsActive(false);
      setIsWorking((prev) => !prev);
      setTime(isWorking ? 300 : 1500);
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  function handleStartStop() {
    if (!isActive) {
      playSound();
    } else {
      stopSound();
    }
    setIsActive(!isActive);
  }

  async function playSound() {
    if (!soundObject) {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/y")
      );
      setSoundObject(sound);
      await sound.playAsync(); // Reproduce el sonido al inicio
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) {
          return;
        }
        if (status.didJustFinish) {
          // Reproduce el sonido nuevamente cuando termine
          sound.replayAsync();
        }
      });
    }
  }

  async function stopSound() {
    if (soundObject) {
      soundObject.stopAsync();
      soundObject.setOnPlaybackStatusUpdate(null); // Limpia el listener
      setSoundObject(null); // Reinicia el objeto de sonido
    }
  }

  return {
    isWorking,
    time,
    currentTime,
    isActive,
    handleStartStop,
    playSound,
    stopSound,
    setCurrentTime,
  };
}

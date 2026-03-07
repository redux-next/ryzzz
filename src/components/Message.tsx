"use client";

import { gradients } from "@/lib/data";
import palette from "../app/assets/color-palette-paint-svgrepo-com.svg";
import camera from "../app/assets/camera.webp";
import { toPng } from "html-to-image";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface Props {
  message: string;
}

const Message = ({ message }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [gradientIndex, setGradientIndex] = useState(0);
  const changeGradient = () => {
    setGradientIndex((prev) => (prev + 1) % gradients.length);
  };

  const clickImage = useCallback(() => {
    if (ref.current === null) {
      return;
    }
    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `Ryzz-${message}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref, message]);

  return (
    <div>
      <div ref={ref} className="p-2">
        <div className="flex flex-col text-center bg-white shadow-md shadow-purple-200 m-3 rounded-2xl pb-2">
          <div
            className={`${gradients[gradientIndex]} mont text-lg md:py-7 md:text-xl py-5 px-3 font-semibold text-white rounded-t-2xl tracking-tight leading-tight relative transition-all duration-500`}
          >
            Send me anonymous messages !
            <p className="absolute  logo ryzz text-zinc-50/60 text-sm right-2 bottom-1">
              R
            </p>
          </div>
          <p className=" p-5 lg:px-7 text-lg md:text-xl font-semibold text-zinc-800 overflow-y-auto md:max-h-96 max-h-[400px] leading-tight ">
            {message}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="flex overflow-x-auto max-w-full pb-2 gap-2 no-scrollbar">
          {gradients.slice(0, 10).map((g, i) => (
            <div
              key={i}
              onClick={() => setGradientIndex(i)}
              className={`${g} h-8 w-8 rounded-full cursor-pointer flex-shrink-0 border-2 ${
                gradientIndex === i ? "border-primary scale-110" : "border-transparent"
              } transition-all`}
            />
          ))}
          <div
            onClick={changeGradient}
            className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center cursor-pointer flex-shrink-0 text-zinc-600 font-bold"
          >
            +
          </div>
        </div>
        <div className="flex justify-center gap-14">
          <Image
            src={palette}
            alt="🎨"
            width={25}
            onClick={changeGradient}
            className="active:scale-95 select-none active:rotate-12 cursor-pointer"
          />
          <Image
            src={camera}
            alt="📸"
            width={30}
            onClick={clickImage}
            className="active:scale-95 select-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Message;

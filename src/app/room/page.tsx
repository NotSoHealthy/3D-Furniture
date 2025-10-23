"use client";
import Room from "@/components/room/Room";
import { FURNITURE_CATALOG } from "@/data/FurnitureCatalog";
import { useRoom } from "@/app/context/RoomProvider";
import Image from "next/image";
import { useState } from "react";
import { CATEGORIES } from "@/data/FurnitureCatalog";
import { FullscreenIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WALL_TEXTURES, FLOOR_TEXTURES } from "@/data/FurnitureCatalog";

export default function Page() {
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const {
    addObject,
    wallTextureId,
    setWallTextureId,
    floorTextureId,
    setFloorTextureId,
    roomWidth,
    setRoomWidth,
    roomHeight,
    setRoomHeight,
  } = useRoom();

  return (
    <div className="h-full w-full flex flex-row overflow-hidden">
      <section
        id="scene"
        className={`flex basis-[75%] flex-col items-center justify-end relative h-full transition-all duration-300 ${
          isFullscreen ? "flex-[1_0_100%] basis-full" : ""
        }`}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[#E6E1DA]">
          <Room />
        </div>
        <div className="absolute top-0 right-0 z-50 p-10">
          <FullscreenIcon
            className="cursor-pointer"
            onClick={() => setIsFullscreen(!isFullscreen)}
          />
        </div>
        <div
          className={`relative bg-white flex items-end z-51 rounded-t-2xl px-4 py-2 gap-1 cursor-pointer transition-all duration-300 ${
            isPopupOpen ? "bottom-[-120px]" : "bottom-0"
          }`}
          onClick={() => setIsPopupOpen(!isPopupOpen)}
        >
          <Image src="icons/pullup-dot.svg" alt="" width={8} height={8} />
          <Image src="icons/pullup-dot.svg" alt="" width={8} height={8} />
          <Image src="icons/pullup-dot.svg" alt="" width={8} height={8} />
          <Image src="icons/pullup-dot.svg" alt="" width={8} height={8} />
          <Image src="icons/pullup-dot.svg" alt="" width={8} height={8} />
        </div>
        <div
          className={`relative h-[120px] bg-white w-full z-50 left-0 flex flex-row items-center justify-center gap-2 transition-all duration-300 ${
            isPopupOpen ? "bottom-[-120px]" : "bottom-0"
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <p>Room Dimensions</p>
            <div className="flex flex-row gap-2">
              <div className="flex flex-col items-center justify-center">
                <span className="text-[#430702] font-semibold">Width</span>
                <Input
                  type="number"
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(Number(e.target.value))}
                  className="w-[150px]"
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-[#430702] font-semibold">Length</span>
                <Input
                  type="number"
                  value={roomHeight}
                  onChange={(e) => setRoomHeight(Number(e.target.value))}
                  className="w-[150px]"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p>Room Style</p>
            <div className="flex flex-row gap-2">
              <div className="flex flex-col items-center justify-center">
                <span className="text-[#430702] font-semibold">Walls</span>
                <Select value={wallTextureId} onValueChange={setWallTextureId}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Select Wall Style" />
                  </SelectTrigger>
                  <SelectContent>
                    {WALL_TEXTURES.map((texture) => (
                      <SelectItem key={texture.id} value={texture.id}>
                        {texture.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-[#430702] font-semibold">Floor</span>
                <Select
                  value={floorTextureId}
                  onValueChange={setFloorTextureId}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Select Floor Style" />
                  </SelectTrigger>
                  <SelectContent>
                    {FLOOR_TEXTURES.map((texture) => (
                      <SelectItem key={texture.id} value={texture.id}>
                        {texture.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="gallery"
        className={`"flex relative flex-1 flex-col border-l border-black/35" ${
          isFullscreen ? "right-[-100%] pointer-events-none" : "right-0"
        }`}
      >
        <div className="flex flex-row w-full">
          {CATEGORIES.map((category, index) => (
            <div
              key={category.id}
              className={`flex flex-1 min-w-0 flex-col items-center justify-center gap-3 p-5 cursor-pointer ${
                selectedCategoryIndex === index ? "bg-white" : "bg-[#E6E1DA]"
              } ${index === selectedCategoryIndex - 1 ? "rounded-br-lg" : ""} ${
                index === selectedCategoryIndex + 1 ? "rounded-bl-lg" : ""
              }`}
              onClick={() => {
                const index = CATEGORIES.findIndex(
                  (cat) => cat.id === category.id
                );
                setSelectedCategoryIndex(index);
              }}
            >
              <Image
                src={`icons/${category.icon}`}
                alt={category.name}
                width={24}
                height={24}
              />
              <div className="relative text-center">
                <span className="text-[#430702] font-semibold opacity-0 pointer-events-none">
                  {category.name.toUpperCase()}
                </span>
                <span
                  className={`absolute inset-0 text-[#430702] text-center ${
                    index === selectedCategoryIndex
                      ? "font-semibold"
                      : "font-normal"
                  }`}
                >
                  {category.name.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col flex-1 overflow-hidden p-3">
          <span className="text-[#430702] font-medium w-fit">
            {CATEGORIES[selectedCategoryIndex].name.toUpperCase()}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 auto-rows-min gap-3 overflow-y-auto">
            {FURNITURE_CATALOG.filter(
              (catalogObject) =>
                catalogObject.categoryId ===
                CATEGORIES[selectedCategoryIndex].id
            ).map((catalogObject, index) => (
              <div
                key={index}
                className="relative border border-[#E6E1DA] rounded-md cursor-pointer aspect-[2/3]"
                onClick={() => {
                  addObject({
                    id: crypto.randomUUID(),
                    catalogId: catalogObject.id,
                    position: catalogObject.defaultOffset,
                    rotation: [...catalogObject.defaultRotation],
                    showBoundingBox: false,
                  });
                }}
              >
                <Image
                  src={
                    "/models/" +
                    catalogObject.categoryId +
                    "/" +
                    catalogObject.id +
                    ".png"
                  }
                  alt="logo"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";
import Room from "@/components/room/Room";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FURNITURE_CATALOG } from "@/data/FurnitureCatalog";
import { useRoom } from "./context/RoomProvider";

export default function Page() {
  const { addObject } = useRoom();

  return (
    <div className="flex flex-row items-center h-full p-4">
      <div className="border">
        {FURNITURE_CATALOG.map((catalogObject) => (
          <Card
            key={catalogObject.id}
            className="w-full max-w-sm bg-gray-400"
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
            <CardHeader>
              <CardTitle>{catalogObject.name}</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>
      <Room />
    </div>
  );
}

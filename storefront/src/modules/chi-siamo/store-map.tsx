"use client"

import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from "@components/ui/map"

const STORE_LNG = 13.780730856861915
const STORE_LAT = 42.69261841982053

export default function StoreMap() {
  return (
    <div className="border border-black rounded-md overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-full min-h-[320px]">
      <Map
        center={[STORE_LNG, STORE_LAT]}
        zoom={15}
        theme="dark"
        className="h-full w-full"
      >
        <MapMarker longitude={STORE_LNG} latitude={STORE_LAT}>
          <MarkerContent>
            <div className="size-4 rounded-full bg-green-400 border-2 border-white shadow-lg" />
          </MarkerContent>
          <MarkerTooltip className="bg-black text-white border border-green-400 rounded-md px-3 py-2 shadow-[2px_2px_0px_#4ade80]">
            <div className="space-y-0.5">
              <p className="font-semibold text-sm">Il Covo di Xur</p>
              <p className="text-xs text-white/70">
                Via G. Galilei SNC
                <br />
                San Nicolò a Tordino, 64100 Teramo
              </p>
            </div>
          </MarkerTooltip>
        </MapMarker>
      </Map>
    </div>
  )
}

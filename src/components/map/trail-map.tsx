import maplibregl, { type Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";

import { poiMeta } from "@/data/mock";
import { trackBounds } from "@/lib/geo";
import type { GeoPoint, Poi } from "@/types";

export interface TrailMapProps {
  track?: GeoPoint[];
  pois?: Poi[];
  position?: GeoPoint | null;
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
  follow?: boolean;
  className?: string;
}

const style: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap",
    },
  },
  layers: [
    { id: "bg", type: "background", paint: { "background-color": "#141618" } },
    {
      id: "osm",
      type: "raster",
      source: "osm",
      paint: { "raster-saturation": -0.55, "raster-brightness-max": 0.82, "raster-contrast": 0.15 },
    },
  ],
};

export default function TrailMap({
  track = [],
  pois = [],
  position = null,
  center,
  zoom = 12,
  interactive = true,
  follow = false,
  className,
}: TrailMapProps) {
  const container = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapLibreMap | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!container.current || map.current) return;
    const start: [number, number] = center
      ? [center[1], center[0]]
      : track.length
        ? [track[0].lng, track[0].lat]
        : [-46.61, -20.719];

    const instance = new maplibregl.Map({
      container: container.current,
      style,
      center: start,
      zoom,
      interactive,
      attributionControl: false,
    });
    map.current = instance;
    if (interactive) {
      instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    }

    instance.on("load", () => {
      if (track.length > 1) {
        instance.addSource("track", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: track.map((p) => [p.lng, p.lat]) },
          },
        });
        instance.addLayer({
          id: "track-glow",
          type: "line",
          source: "track",
          paint: { "line-color": "#ffb020", "line-width": 12, "line-opacity": 0.18, "line-blur": 6 },
        });
        instance.addLayer({
          id: "track-line",
          type: "line",
          source: "track",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#ffb020", "line-width": 4 },
        });

        const b = trackBounds(track);
        instance.fitBounds(
          [
            [b.minLng, b.minLat],
            [b.maxLng, b.maxLat],
          ],
          { padding: 44, animate: false },
        );
      }

      for (const poi of pois) {
        const el = document.createElement("div");
        el.textContent = poiMeta[poi.kind].icon;
        el.style.cssText =
          "font-size:15px;line-height:28px;text-align:center;width:28px;height:28px;border-radius:999px;background:#1d2023;border:1px solid rgba(255,176,32,.6);box-shadow:0 4px 12px rgba(0,0,0,.5)";
        new maplibregl.Marker({ element: el })
          .setLngLat([poi.lng, poi.lat])
          .setPopup(
            new maplibregl.Popup({ offset: 16, closeButton: false }).setHTML(
              `<strong>${poi.name}</strong><br/>${poiMeta[poi.kind].label}`,
            ),
          )
          .addTo(instance);
      }
    });

    return () => {
      instance.remove();
      map.current = null;
      marker.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trilha ao vivo (gravação)
  useEffect(() => {
    const instance = map.current;
    if (!instance || !instance.isStyleLoaded() || track.length < 2) return;
    const src = instance.getSource("live") as maplibregl.GeoJSONSource | undefined;
    const data: maplibregl.GeoJSONSourceSpecification["data"] = {
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: track.map((p) => [p.lng, p.lat]) },
    };
    if (src) {
      src.setData(data);
    } else if (!instance.getSource("track")) {
      instance.addSource("live", { type: "geojson", data });
      instance.addLayer({
        id: "live-line",
        type: "line",
        source: "live",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#ffb020", "line-width": 5 },
      });
    }
  }, [track]);

  // Posição atual
  useEffect(() => {
    const instance = map.current;
    if (!instance || !position) return;
    if (!marker.current) {
      const el = document.createElement("div");
      el.style.cssText =
        "width:18px;height:18px;border-radius:999px;background:#ffb020;border:3px solid #15181a;box-shadow:0 0 0 8px rgba(255,176,32,.22)";
      marker.current = new maplibregl.Marker({ element: el }).setLngLat([position.lng, position.lat]).addTo(instance);
    } else {
      marker.current.setLngLat([position.lng, position.lat]);
    }
    if (follow) instance.easeTo({ center: [position.lng, position.lat], duration: 600 });
  }, [position, follow]);

  return <div ref={container} className={className} />;
}

export interface Earthquake {
  id: string;
  mag: number;
  place: string;
  time: Date;
  longitude: number;
  latitude: number;
  depth: number;
  status: string;
  url: string;
  title: string;
}

export interface UsgsFeature {
  id: string;
  geometry: {
    coordinates: [number, number, number];
  };
  properties: {
    mag: number;
    place: string;
    time: number;
    status: string;
    url: string;
    title: string;
  };
}

export interface UsgsResponse {
  features: UsgsFeature[];
}
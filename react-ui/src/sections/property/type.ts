export interface PropertyDetails {
  houseType?: string;
  houseSize?: number;
  electricVehicle?: boolean;
  solarPower?: boolean;
}

export interface MyPropertyProps {
  details: PropertyDetails;
  refresh: () => void;
}

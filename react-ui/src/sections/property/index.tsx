import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { MyPropertyProps } from "./type";

const PropertyTypes = ["Flat", "Studio", "Terrace", "Semi", "House"];

export default function MyProperty({ details, refresh }: MyPropertyProps) {
  const [propertyType, setPropertyType] = useState<string>();
  const [propertySize, setPropertySize] = useState<number>(0);
  const [hasEV, setHasEV] = useState<boolean>();
  const [hasSolarPanels, setHasSolarPanels] = useState<boolean>();

  useEffect(() => {
    setPropertyType(details.houseType);
    setPropertySize(details.houseSize ?? 0);
    setHasEV(details.electricVehicle);
    setHasSolarPanels(details.solarPower);
  }, [details]);

  useEffect(() => {
    const updateDetails = () => {
      const requestBody = JSON.stringify({
        house_type: propertyType,
        house_size: isNaN(propertySize) ? 0 : propertySize,
        electric_vehicle: hasEV,
        solar_power: hasSolarPanels,
      });

      return (
        fetch(`/api/v1/profile`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        })
          // .then(refresh)
          .catch((error) => console.error("Error modifiying review:", error))
      );
    };

    updateDetails();
  }, [propertyType, propertySize, hasEV, hasSolarPanels, refresh]);

  return (
    <section className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">My Property</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex flex-col items-start gap-2">
          <Label htmlFor="property-type">Property Type</Label>
          <Select
            value={propertyType}
            onValueChange={(propertyType) => setPropertyType(propertyType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              {PropertyTypes.map((type: string, index) => (
                <SelectItem key={index} value={type.toLowerCase()}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-start gap-2">
          <Label htmlFor="property-type">Property Type</Label>
          <Input
            type="number"
            placeholder="sqr. m"
            value={propertySize}
            onChange={(event) => {
              setPropertySize(parseInt(event.target.value));
            }}
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <Label htmlFor="ev-charging">EV Car Charging</Label>
          <Checkbox
            id="ev-charging"
            checked={hasEV}
            onCheckedChange={(checked: boolean) => setHasEV(checked)}
            className="mt-3"
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <Label htmlFor="solar-panels">Solar Panels</Label>
          <Checkbox
            id="solar-panels"
            checked={hasSolarPanels}
            onCheckedChange={(checked: boolean) => setHasSolarPanels(checked)}
            className="mt-3"
          />
        </div>
      </div>
    </section>
  );
}

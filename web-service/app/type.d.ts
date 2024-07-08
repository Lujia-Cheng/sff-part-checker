// Define export interfaces for each component type based on the provided JSON structures
export interface Case {
  name: string;
  price: number | null;
  type: string;
  color: string;
  psu: string | null;
  side_panel: string;
  external_volume: number;
  internal_35_bays: number;
}
export interface CpuCooler {
  name: string;
  price: number | null;
  rpm: number[];
  noise_level: number;
  color: string;
  size: number;
}
export interface VideoCard {
  name: string;
  price: number | null;
  chipset: string;
  memory: number;
  core_clock: number;
  boost_clock: number;
  color: string;
  length: number;
}
export interface Motherboard {
  name: string;
  price: number | null;
  socket: string;
  form_factor: string;
  max_memory: number;
  memory_slots: number;
  color: string;
}

export interface PowerSupply {
  name: string;
  price: number | null;
  type: string;
  efficiency: string;
  wattage: number;
  modular: boolean;
  color: string | null;
}

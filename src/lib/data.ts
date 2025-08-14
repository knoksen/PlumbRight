export interface Part {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  aiHint: string;
  category: 'Pipes & Fittings' | 'Valves' | 'Fixtures' | 'Tools & Sealants';
}

export const partsData: Part[] = [
  // Pipes & Fittings
  {
    id: 'pvc-elbow-90',
    name: 'PVC 90-Degree Elbow',
    description: 'A standard 1/2 inch PVC elbow for changing pipe direction. Schedule 40.',
    price: 0.89,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'pvc elbow',
    category: 'Pipes & Fittings',
  },
  {
    id: 'copper-pipe-10ft',
    name: 'Copper Pipe - 10ft',
    description: 'A 10-foot length of 3/4 inch Type L copper pipe for water supply lines.',
    price: 34.5,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'copper pipe',
    category: 'Pipes & Fittings',
  },
  {
    id: 'pex-tubing-blue-100ft',
    name: 'PEX Tubing, Blue - 100ft',
    description: '100-foot coil of 1/2 inch blue PEX tubing for cold water lines. Flexible and durable.',
    price: 45.99,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'pex tubing',
    category: 'Pipes & Fittings',
  },
  {
    id: 'braided-supply-line',
    name: 'Braided Faucet Supply Line',
    description: '20-inch stainless steel braided supply line with 3/8" comp x 1/2" FIP fittings.',
    price: 7.49,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'braided hose',
    category: 'Pipes & Fittings',
  },
  {
    id: 'p-trap-1-1-2',
    name: '1-1/2" P-Trap Assembly',
    description: 'Polypropylene P-trap kit for kitchen or bathroom sinks. Includes all nuts and washers.',
    price: 6.25,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'p trap',
    category: 'Pipes & Fittings',
  },
  {
    id: 'galvanized-nipple-6in',
    name: 'Galvanized Nipple, 3/4" x 6"',
    description: 'A 6-inch long, 3/4 inch diameter galvanized steel nipple for water and gas applications.',
    price: 4.29,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'galvanized pipe',
    category: 'Pipes & Fittings',
  },
  {
    id: 'push-to-connect-coupling',
    name: '1/2" Push-to-Connect Coupling',
    description: 'Brass push-fit coupling for copper, PEX, and CPVC. No soldering required.',
    price: 8.99,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'push coupling',
    category: 'Pipes & Fittings',
  },

  // Valves
  {
    id: 'ball-valve-1/2',
    name: '1/2" Brass Ball Valve',
    description: 'Full-port brass ball valve with a lever handle for shut-off applications.',
    price: 12.75,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'ball valve',
    category: 'Valves',
  },
  {
    id: 'gate-valve-3-4',
    name: '3/4" Gate Valve',
    description: 'Brass gate valve for on/off control without pressure drop. Not for throttling.',
    price: 18.50,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'gate valve',
    category: 'Valves',
  },
  {
    id: 'angle-stop-valve',
    name: '1/2" x 3/8" Angle Stop Valve',
    description: 'Chrome-plated angle stop valve for toilets and faucets. Quarter-turn operation.',
    price: 9.80,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'angle stop',
    category: 'Valves',
  },

  // Fixtures
  {
    id: 'sink-faucet-chrome',
    name: 'Chrome Bathroom Faucet',
    description: 'Modern single-handle chrome faucet for bathroom sinks. Includes drain assembly.',
    price: 89.99,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'sink faucet',
    category: 'Fixtures',
  },
  {
    id: 'kitchen-faucet-ss',
    name: 'Stainless Steel Kitchen Faucet',
    description: 'Pull-down sprayer kitchen faucet in a brushed stainless steel finish.',
    price: 179.00,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'kitchen faucet',
    category: 'Fixtures',
  },
  {
    id: 'standard-toilet-kit',
    name: 'Standard Two-Piece Toilet',
    description: '1.6 GPF two-piece toilet kit. Includes tank, bowl, seat, and wax ring.',
    price: 129.00,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'toilet',
    category: 'Fixtures',
  },
  {
    id: 'shower-head-rain',
    name: 'Rainfall Shower Head',
    description: '8-inch chrome rainfall shower head with high-pressure nozzles.',
    price: 45.00,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'shower head',
    category: 'Fixtures',
  },

  // Tools & Sealants
  {
    id: 'pipe-thread-sealant',
    name: 'Pipe Thread Sealant',
    description: '50ml tube of non-hardening pipe thread sealant for metal pipes. Withstands high pressure.',
    price: 9.99,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'pipe sealant',
    category: 'Tools & Sealants',
  },
  {
    id: 'teflon-tape',
    name: 'Teflon Tape Roll',
    description: '1/2 inch x 520 inch roll of high-density PTFE thread seal tape.',
    price: 1.49,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'teflon tape',
    category: 'Tools & Sealants',
  },
  {
    id: 'pipe-wrench-14in',
    name: '14" Pipe Wrench',
    description: 'Heavy-duty 14-inch cast iron pipe wrench for gripping and turning pipes.',
    price: 24.99,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'pipe wrench',
    category: 'Tools & Sealants',
  },
  {
    id: 'tubing-cutter',
    name: 'Copper Tubing Cutter',
    description: 'Cuts 1/8" to 1-1/8" copper, brass, and aluminum tubing cleanly.',
    price: 15.79,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'tubing cutter',
    category: 'Tools & Sealants',
  },
];

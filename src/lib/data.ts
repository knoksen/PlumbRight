export interface Part {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  aiHint: string;
}

export const partsData: Part[] = [
  {
    id: 'pvc-elbow-90',
    name: 'PVC 90-Degree Elbow',
    description: 'A standard 1/2 inch PVC elbow for changing pipe direction. Schedule 40.',
    price: 0.89,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'pvc elbow'
  },
  {
    id: 'copper-pipe-10ft',
    name: 'Copper Pipe - 10ft',
    description: 'A 10-foot length of 3/4 inch Type L copper pipe for water supply lines.',
    price: 34.5,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'copper pipe'
  },
  {
    id: 'ball-valve-1/2',
    name: '1/2" Brass Ball Valve',
    description: 'Full-port brass ball valve with a lever handle for shut-off applications.',
    price: 12.75,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'ball valve'
  },
  {
    id: 'pex-tubing-blue-100ft',
    name: 'PEX Tubing, Blue - 100ft',
    description: '100-foot coil of 1/2 inch blue PEX tubing for cold water lines. Flexible and durable.',
    price: 45.99,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'pex tubing'
  },
  {
    id: 'sink-faucet-chrome',
    name: 'Chrome Bathroom Faucet',
    description: 'Modern single-handle chrome faucet for bathroom sinks. Includes drain assembly.',
    price: 89.99,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'sink faucet'
  },
  {
    id: 'braided-supply-line',
    name: 'Braided Faucet Supply Line',
    description: '20-inch stainless steel braided supply line with 3/8" comp x 1/2" FIP fittings.',
    price: 7.49,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'braided hose'
  },
  {
    id: 'p-trap-1-1-2',
    name: '1-1/2" P-Trap Assembly',
    description: 'Polypropylene P-trap kit for kitchen or bathroom sinks. Includes all nuts and washers.',
    price: 6.25,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'p trap'
  },
  {
    id: 'pipe-thread-sealant',
    name: 'Pipe Thread Sealant',
    description: '50ml tube of non-hardening pipe thread sealant for metal pipes. Withstands high pressure.',
    price: 9.99,
    imageUrl: 'https://placehold.co/100x100.png',
    aiHint: 'pipe sealant'
  },
];

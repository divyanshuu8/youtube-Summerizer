import { NhostClient } from '@nhost/nhost-js';

// Use environment variables for the subdomain and region
const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN, // Get subdomain from .env
  region: import.meta.env.VITE_NHOST_REGION        // Get region from .env
});

export default nhost;

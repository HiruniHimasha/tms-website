import { Cloudinary } from '@cloudinary/url-gen';

// Initialize Cloudinary instance
const cld = new Cloudinary({
  cloud: {
    cloudName: 'dzmy4dzqb' 
  }
});

export default cld;
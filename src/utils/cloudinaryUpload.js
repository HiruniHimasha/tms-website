export const uploadToCloudinary = async (file) => {
  try {
    // Replace with your actual Cloudinary cloud name
    const cloudName = 'dzmy4dzqb'; // Your cloud name from Cloudinary dashboard
    
    // Replace with your upload preset name (exactly as created in Cloudinary)
    const uploadPreset = 'certificate_uploads'; // Must match the preset name exactly
    
    console.log('Uploading to Cloudinary:', {
      cloudName,
      uploadPreset,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size must be less than 10MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    // Optional: Add folder organization
    formData.append('folder', 'certificates');
    
    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    console.log('Cloudinary response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary upload failed:', errorText);
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Cloudinary upload success:', data);
    
    return {
      url: data.secure_url,
      publicId: data.public_id,
      format: data.format,
      bytes: data.bytes,
      width: data.width,
      height: data.height
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error(error.message || 'Failed to upload image. Please try again.');
  }
};
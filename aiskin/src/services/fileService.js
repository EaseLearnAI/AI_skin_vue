/**
 * File Service
 * Handles file operations such as image selection and uploads
 */
const fileService = {
  /**
   * Create a file input to select images
   * @param {Object} options - Options for file selection
   * @param {Boolean} options.multiple - Allow multiple file selection
   * @param {String} options.accept - MIME types to accept
   * @param {Function} options.onSelect - Callback when files are selected
   */
  selectImage(options = {}) {
    console.log('🖼️ Creating file input for image selection');
    
    // Default options
    const defaultOptions = {
      multiple: false,
      accept: 'image/jpeg,image/png,image/gif',
      onSelect: () => {}
    };
    
    const config = { ...defaultOptions, ...options };
    
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = config.accept;
    input.multiple = config.multiple;
    input.style.display = 'none';
    
    // Add file input to body
    document.body.appendChild(input);
    
    // Listen for file selection
    input.addEventListener('change', (event) => {
      const files = Array.from(event.target.files);
      console.log(`🖼️ Selected ${files.length} image(s)`, files);
      
      // Convert files to objects with preview URLs
      const filesWithPreview = files.map(file => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: URL.createObjectURL(file)
      }));
      
      // Call onSelect callback with files
      config.onSelect(filesWithPreview);
      
      // Remove input from DOM
      document.body.removeChild(input);
    });
    
    // Trigger file selection dialog
    input.click();
  },
  
  /**
   * Create a FormData object with file
   * @param {File} file - File to add to FormData
   * @param {String} fieldName - Name of the form field
   * @returns {FormData} - FormData object with file
   */
  createFormData(file, fieldName = 'productImage') {
    const formData = new FormData();
    formData.append(fieldName, file);
    return formData;
  }
};

export default fileService; 
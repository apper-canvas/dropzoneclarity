import uploadFilesData from '../mockData/uploadFiles.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let uploadFiles = [...uploadFilesData];

const uploadFileService = {
  getAll: async () => {
    await delay(300);
    return [...uploadFiles];
  },

  getById: async (id) => {
    await delay(200);
    const file = uploadFiles.find(f => f.Id === parseInt(id, 10));
    return file ? { ...file } : null;
  },

  create: async (fileData) => {
    await delay(400);
    const maxId = uploadFiles.length > 0 ? Math.max(...uploadFiles.map(f => f.Id)) : 0;
    const newFile = {
      Id: maxId + 1,
      ...fileData,
      progress: 0,
      status: 'pending',
      uploadSpeed: 0,
      timeRemaining: 0
    };
    uploadFiles.push(newFile);
    return { ...newFile };
  },

  update: async (id, data) => {
    await delay(200);
    const index = uploadFiles.findIndex(f => f.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('File not found');
    }
    
    const updatedFile = {
      ...uploadFiles[index],
      ...data,
      Id: uploadFiles[index].Id // Prevent Id modification
    };
    
    uploadFiles[index] = updatedFile;
    return { ...updatedFile };
  },

  delete: async (id) => {
    await delay(200);
    const index = uploadFiles.findIndex(f => f.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('File not found');
    }
    
    const deletedFile = uploadFiles[index];
    uploadFiles.splice(index, 1);
    return { ...deletedFile };
  },

  // Simulate file upload progress
  simulateUpload: async (id, onProgress) => {
    const file = uploadFiles.find(f => f.Id === parseInt(id, 10));
    if (!file) throw new Error('File not found');

    // Update status to uploading
    await uploadFileService.update(id, { status: 'uploading' });

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += Math.random() * 10) {
      if (progress > 100) progress = 100;
      
      const uploadSpeed = 1.2 + Math.random() * 2.3; // MB/s
      const timeRemaining = progress < 100 ? (file.size * (100 - progress) / 100) / (uploadSpeed * 1024 * 1024) : 0;
      
      await uploadFileService.update(id, {
        progress: Math.round(progress),
        uploadSpeed,
        timeRemaining: Math.round(timeRemaining)
      });
      
      if (onProgress) onProgress(Math.round(progress));
      
      if (progress < 100) {
        await delay(200 + Math.random() * 300);
      }
    }

    // Mark as completed
    await uploadFileService.update(id, {
      status: 'completed',
      progress: 100,
      uploadSpeed: 0,
      timeRemaining: 0
    });
  },

  clear: async () => {
    await delay(200);
    uploadFiles = [];
    return [];
  }
};

export default uploadFileService;
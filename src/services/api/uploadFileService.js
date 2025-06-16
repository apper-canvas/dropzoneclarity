import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const uploadFileService = {
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "size" } },
          { field: { Name: "type" } },
          { field: { Name: "preview" } },
          { field: { Name: "progress" } },
          { field: { Name: "status" } },
          { field: { Name: "upload_speed" } },
          { field: { Name: "time_remaining" } }
        ]
      };

      const response = await apperClient.fetchRecords('upload_file', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching upload files:", error);
      toast.error("Failed to fetch upload files");
      return [];
    }
  },

  getById: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "size" } },
          { field: { Name: "type" } },
          { field: { Name: "preview" } },
          { field: { Name: "progress" } },
          { field: { Name: "status" } },
          { field: { Name: "upload_speed" } },
          { field: { Name: "time_remaining" } }
        ]
      };

      const response = await apperClient.getRecordById('upload_file', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching upload file with ID ${id}:`, error);
      return null;
    }
  },

  create: async (fileData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: fileData.name || '',
          Tags: fileData.tags || '',
          Owner: fileData.owner || null,
          size: fileData.size || 0,
          type: fileData.type || '',
          preview: fileData.preview || '',
          progress: fileData.progress || 0,
          status: fileData.status || 'pending',
          upload_speed: fileData.uploadSpeed || 0,
          time_remaining: fileData.timeRemaining || 0
        }]
      };

      const response = await apperClient.createRecord('upload_file', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create upload file:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }

      throw new Error('Failed to create upload file');
    } catch (error) {
      console.error("Error creating upload file:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateData = {
        Id: parseInt(id, 10)
      };

      // Map data properties to database field names
      if (data.name !== undefined) updateData.Name = data.name;
      if (data.tags !== undefined) updateData.Tags = data.tags;
      if (data.owner !== undefined) updateData.Owner = data.owner;
      if (data.size !== undefined) updateData.size = data.size;
      if (data.type !== undefined) updateData.type = data.type;
      if (data.preview !== undefined) updateData.preview = data.preview;
      if (data.progress !== undefined) updateData.progress = data.progress;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.uploadSpeed !== undefined) updateData.upload_speed = data.uploadSpeed;
      if (data.timeRemaining !== undefined) updateData.time_remaining = data.timeRemaining;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('upload_file', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update upload file:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }

      throw new Error('Failed to update upload file');
    } catch (error) {
      console.error("Error updating upload file:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await apperClient.deleteRecord('upload_file', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete upload file:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting upload file:", error);
      throw error;
    }
  },

  // Simulate file upload progress with database updates
  simulateUpload: async (id, onProgress) => {
    try {
      // Update status to uploading
      await uploadFileService.update(id, { status: 'uploading' });

      // Get file info for calculations
      const file = await uploadFileService.getById(id);
      if (!file) throw new Error('File not found');

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
    } catch (error) {
      // Mark as error if upload fails
      await uploadFileService.update(id, { status: 'error' });
      throw error;
    }
  },

  clear: async () => {
    try {
      // Get all files first
      const files = await uploadFileService.getAll();
      const fileIds = files.map(f => f.Id);
      
      if (fileIds.length === 0) return [];

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: fileIds
      };

      const response = await apperClient.deleteRecord('upload_file', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      return [];
    } catch (error) {
      console.error("Error clearing upload files:", error);
      throw error;
    }
  }
};

export default uploadFileService;
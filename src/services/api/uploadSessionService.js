import { toast } from 'react-toastify';

const uploadSessionService = {
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
          { field: { Name: "total_files" } },
          { field: { Name: "total_size" } },
          { field: { Name: "uploaded_size" } },
          { field: { Name: "overall_progress" } },
          { field: { Name: "start_time" } },
          { field: { Name: "status" } }
        ]
      };

      const response = await apperClient.fetchRecords('upload_session', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching upload sessions:", error);
      toast.error("Failed to fetch upload sessions");
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
          { field: { Name: "total_files" } },
          { field: { Name: "total_size" } },
          { field: { Name: "uploaded_size" } },
          { field: { Name: "overall_progress" } },
          { field: { Name: "start_time" } },
          { field: { Name: "status" } }
        ]
      };

      const response = await apperClient.getRecordById('upload_session', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching upload session with ID ${id}:`, error);
      return null;
    }
  },

  create: async (sessionData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: sessionData.name || 'Upload Session',
          Tags: sessionData.tags || '',
          Owner: sessionData.owner || null,
          total_files: sessionData.totalFiles || 0,
          total_size: sessionData.totalSize || 0,
          uploaded_size: sessionData.uploadedSize || 0,
          overall_progress: sessionData.overallProgress || 0,
          start_time: sessionData.startTime || new Date().toISOString(),
          status: sessionData.status || 'active'
        }]
      };

      const response = await apperClient.createRecord('upload_session', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create upload session:${JSON.stringify(failedRecords)}`);
          
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

      throw new Error('Failed to create upload session');
    } catch (error) {
      console.error("Error creating upload session:", error);
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
      if (data.totalFiles !== undefined) updateData.total_files = data.totalFiles;
      if (data.totalSize !== undefined) updateData.total_size = data.totalSize;
      if (data.uploadedSize !== undefined) updateData.uploaded_size = data.uploadedSize;
      if (data.overallProgress !== undefined) updateData.overall_progress = data.overallProgress;
      if (data.startTime !== undefined) updateData.start_time = data.startTime;
      if (data.status !== undefined) updateData.status = data.status;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('upload_session', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update upload session:${JSON.stringify(failedUpdates)}`);
          
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

      throw new Error('Failed to update upload session');
    } catch (error) {
      console.error("Error updating upload session:", error);
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

      const response = await apperClient.deleteRecord('upload_session', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete upload session:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting upload session:", error);
      throw error;
    }
  },

  getCurrent: async () => {
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
          { field: { Name: "total_files" } },
          { field: { Name: "total_size" } },
          { field: { Name: "uploaded_size" } },
          { field: { Name: "overall_progress" } },
          { field: { Name: "start_time" } },
          { field: { Name: "status" } }
        ],
        where: [
          {
            FieldName: "status",
            Operator: "EqualTo",
            Values: ["active"]
          }
        ]
      };

      const response = await apperClient.fetchRecords('upload_session', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error("Error fetching current upload session:", error);
      return null;
    }
  }
};

export default uploadSessionService;
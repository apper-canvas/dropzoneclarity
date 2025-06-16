import uploadSessionsData from '../mockData/uploadSessions.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let uploadSessions = [...uploadSessionsData];

const uploadSessionService = {
  getAll: async () => {
    await delay(300);
    return [...uploadSessions];
  },

  getById: async (id) => {
    await delay(200);
    const session = uploadSessions.find(s => s.Id === parseInt(id, 10));
    return session ? { ...session } : null;
  },

  create: async (sessionData) => {
    await delay(300);
    const maxId = uploadSessions.length > 0 ? Math.max(...uploadSessions.map(s => s.Id)) : 0;
    const newSession = {
      Id: maxId + 1,
      ...sessionData,
      startTime: new Date().toISOString(),
      status: 'active'
    };
    uploadSessions.push(newSession);
    return { ...newSession };
  },

  update: async (id, data) => {
    await delay(200);
    const index = uploadSessions.findIndex(s => s.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Session not found');
    }
    
    const updatedSession = {
      ...uploadSessions[index],
      ...data,
      Id: uploadSessions[index].Id // Prevent Id modification
    };
    
    uploadSessions[index] = updatedSession;
    return { ...updatedSession };
  },

  delete: async (id) => {
    await delay(200);
    const index = uploadSessions.findIndex(s => s.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Session not found');
    }
    
    const deletedSession = uploadSessions[index];
    uploadSessions.splice(index, 1);
    return { ...deletedSession };
  },

  getCurrent: async () => {
    await delay(200);
    const activeSession = uploadSessions.find(s => s.status === 'active');
    return activeSession ? { ...activeSession } : null;
  }
};

export default uploadSessionService;
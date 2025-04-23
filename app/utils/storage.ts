// Simple in-memory storage for bond requests
let bondRequests: any[] = [];

export const storage = {
  addRequest: (request: any) => {
    bondRequests.unshift(request); // Add to beginning of array
    return true;
  },
  getRequests: () => {
    return bondRequests;
  },
  clearRequests: () => {
    bondRequests = [];
  }
}; 
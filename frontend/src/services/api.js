const API_URL = 'http://localhost:3001/api';

export const fetchAnalytics = async () => {
  const response = await fetch(`${API_URL}/analytics`);
  if (!response.ok) throw new Error('Error fetching analytics');
  return response.json();
};

export const fetchOpportunities = async () => {
  const response = await fetch(`${API_URL}/products/opportunities`);
  if (!response.ok) throw new Error('Error fetching opportunities');
  return response.json();
};

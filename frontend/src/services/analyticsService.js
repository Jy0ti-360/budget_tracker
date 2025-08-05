import api from "./api";

export const getMonthlyTrend = async (months = 12) =>{
    const res = await api.get(`/analytics/monthly-trend?months=${months}`);
    return res.data;
}

export const getCashFlow = async (range = 'daily', count=7) =>{
    try {
        const param = range === 'weekly' ? `weeks=${count}` : `days=${count}`;
        const res = await api.get(`/analytics/cash-flow?range=${range}&${param}`);
        return res;
    } catch (error) {
        console.error('getCashFlow API error:', error);
        throw error;
    }
}

export const getProfitLoss = async (startDate, endDate) => {
  try {
    const res = await api.get(`/analytics/profit-loss?start=${startDate}&end=${endDate}`);
    return res.data;
  } catch (error) {
    console.error('getProfitLoss API error:', error);
    throw error;
  }
};

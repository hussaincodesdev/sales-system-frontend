import { BASE_URL } from "@/api/config";
import { Commission, INewCommission } from "@/types/commission";
import axios from "axios";

export const getCommissions = async ({
  token,
}: {
  token: string;
}): Promise<Commission[] | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/commissions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== 200) {
      return null;
    }

    return response.data.response.data;
  } catch (error) {
    return null;
  }
};

export const getAllCommissions = async ({
  token,
}: {
  token: string;
}): Promise<Commission[] | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/commissions/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== 200) {
      return null;
    }

    return response.data.response.data;
  } catch (error) {
    return null;
  }
};

export const createCommission = async ({
  token,
  data,
}: {
  token: string;
  data: INewCommission;
}): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/commissions/create`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.status === 201;
  } catch (error) {
    return false;
  }
};

export const updateCommission = async ({
  token,
  data,
  id,
}: {
  token: string;
  data: INewCommission;
  id: number;
}): Promise<boolean> => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/commissions/update/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const deleteCommission = async ({
  token,
  id,
}: {
  token: string;
  id: number;
}): Promise<boolean> => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/commissions/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const exportCommission = async ({
  token,
}: {
  token: string;
}): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/commissions/export`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return false;
  }
};

export const postMarkCommissionAsPaid = async ({
  token,
  id,
}: {
  token: string;
  id: number;
}): Promise<boolean> => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/commissions/mark-paid/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const postMarkCommissionAsDue = async ({
  token,
  id,
}: {
  token: string;
  id: number;
}): Promise<boolean> => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/commissions/mark-due/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.status === 200;
  } catch (error) {
    return false;
  }
};

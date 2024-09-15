import { BASE_URL } from "@/api/config";
import { Application } from "@/types/application";
import { INewUser, User } from "@/types/user";
import axios from "axios";

interface DashboardData {
  totalSalesCoaches: number;
  totalSalesAgents: number;
  totalApplications: number;
  incompleteApplicationsThisWeek: Application[];
}

export const getUserInfo = async ({
  token,
}: {
  token: string;
}): Promise<User | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== 200) {
      return null;
    }

    return response.data.response.data[0];
  } catch (error) {
    return null;
  }
};
export const getSalesCoaches = async ({
  token,
}: {
  token: string;
}): Promise<User[] | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/users/sales-coaches`, {
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

export const getSalesAgents = async ({
  token,
}: {
  token: string;
}): Promise<User[] | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/users/sales-agents`, {
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
export const getCoachAgents = async ({
  token,
}: {
  token: string;
}): Promise<User[] | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/coaches/agents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== 200) {
      return null;
    }

    console.log("response.data.response.data", response.data.response.data);
    return response.data.response.data;
  } catch (error) {
    return null;
  }
};

export const createSalesCoach = async ({
  token,
  data,
}: {
  token: string;
  data: INewUser;
}): Promise<boolean> => {
  try {
    const req = { ...data, role: "sales_coach" };
    const response = await axios.post(`${BASE_URL}/api/v1/auth/register`, req, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.status === 201;
  } catch (error) {
    return false;
  }
};
export const createSalesAgent = async ({
  token,
  data,
}: {
  token: string;
  data: INewUser;
}): Promise<boolean> => {
  try {
    const req = { ...data, role: "sales_coach" };
    const response = await axios.post(
      `${BASE_URL}/api/v1/users/sales-agents`,
      req,
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

export const updateSalesCoach = async ({
  token,
  data,
  id,
}: {
  token: string;
  data: INewUser;
  id: number;
}): Promise<boolean> => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/users/sales-coach/${id}`,
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
export const updateSalesAgent = async ({
  token,
  data,
  id,
}: {
  token: string;
  data: INewUser;
  id: number;
}): Promise<boolean> => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/users/sales-agents/${id}`,
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

export const getProfileData = async ({
  token,
}: {
  token: string;
}): Promise<any[] | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== 200) {
      return null;
    }

    return response.data.response.data[0];
  } catch (error) {
    return null;
  }
};

export const updateProfileData = async ({
  token,
  data,
}: {
  token: string;
  data: any;
}): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/users/profile`,
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

export const deleteSalesCoach = async ({
  token,
  id,
}: {
  token: string;
  id: number;
}): Promise<boolean> => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/users/sales-coach/${id}`,
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

export const deleteSalesAgent = async ({
  token,
  id,
}: {
  token: string;
  id: number;
}): Promise<boolean> => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/users/sales-agents/${id}`,
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

export const exportSalesCoach = async ({
  token,
}: {
  token: string;
}): Promise<any> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/users/export-sales-coach`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    return false;
  }
};

export const exportSalesAgent = async ({
  token,
}: {
  token: string;
}): Promise<any> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/users/export-sales-agents`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    return false;
  }
};

export const getDashboardData = async ({
  token,
}: {
  token: string;
}): Promise<DashboardData | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/users/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== 200) {
      return null;
    }

    return response.data.response.data[0];
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
};

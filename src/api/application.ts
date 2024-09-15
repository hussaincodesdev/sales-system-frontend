import { BASE_URL } from "@/api/config";
import { Application, INewApplication } from "@/types/application";
import axios from "axios";

export const getApplications = async ({
  token,
}: {
  token: string;
}): Promise<Application[] | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/applications`, {
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

export const getAllApplications = async ({
  token,
}: {
  token: string;
}): Promise<Application[] | null> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/applications/admin/get`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status !== 200) {
      return null;
    }

    return response.data.response.data;
  } catch (error) {
    return null;
  }
};

export const getCoachApplications = async ({
  token,
}: {
  token: string;
}): Promise<Application[] | null> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/applications/coach/get`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status !== 200) {
      return null;
    }

    return response.data.response.data;
  } catch (error) {
    return null;
  }
};

export const createApplication = async ({
  token,
  application,
}: {
  token: string;
  application: INewApplication;
}): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/applications/create`,
      application,
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

export const updateApplication = async ({
  token,
  application,
  id,
}: {
  token: string;
  application: INewApplication;
  id: number;
}): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/applications/update/${id}`,
      application,
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

export const deleteApplication = async ({
  token,
  id,
}: {
  token: string;
  id: number;
}): Promise<boolean> => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/applications/delete/${id}`,
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

export const exportApplication = async ({
  token,
}: {
  token: string;
}): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/applications/export`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return false;
  }
};

export const exportCoachApplications = async ({
  token,
}: {
  token: string;
}): Promise<any> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/applications/coach/export`,
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

export const exportAllApplications = async ({
  token,
}: {
  token: string;
}): Promise<any> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/applications/admin/export`,
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

export const postMarkApplicationCompleted = async ({
  token,
  id,
}: {
  token: string;
  id: number;
}): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/applications/complete/${id}`,
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

export const postMarkApplicationIncomplete = async ({
  token,
  id,
}: {
  token: string;
  id: number;
}): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/applications/incomplete/${id}`,
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
